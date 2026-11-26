import { DurableObject } from 'cloudflare:workers';
import { editKeyPattern, isRevision, originalSharedSnapshot, sharedSlidesPath,
  type SharedSlides, type SharedSnapshot, type SlideVersion } from '../src/shared-slide-data';
import { applySharedSlideChange, mergeSlideEdits } from '../src/shared-slide-changes';
import committedSlides from '../shared-slides.json';

export interface SharedSlidesEnv {
  SHARED_SLIDES: DurableObjectNamespace<SharedSlideHistory>;
  SLIDE_EDIT_KEY?: string;
}

const pageLength = 50;
const maxBodyBytes = 128 * 1024;
type StoredVersion = { revision: number; savedAt: string; summary: string; document: string };

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'Vary': 'Authorization', 'X-Content-Type-Options': 'nosniff' } });
}

function canEdit(request: Request, secret: string | undefined) {
  const candidate = request.headers.get('Authorization')?.match(/^Bearer ([0-9a-f]{64})$/)?.[1];
  if (!candidate || !secret || !editKeyPattern.test(secret)) return false;
  const encoder = new TextEncoder();
  return crypto.subtle.timingSafeEqual(encoder.encode(candidate), encoder.encode(secret));
}

async function readChange(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get('Content-Type')?.startsWith('application/json') || !request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) { await reader.cancel(); return null; }
      text += decoder.decode(value, { stream: true });
    }
    const data = JSON.parse(text + decoder.decode());
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch { return null; }
  finally { reader.releaseLock(); }
}

function storedResult(row: StoredVersion | undefined): SharedSnapshot {
  if (!row) return originalSharedSnapshot;
  return { ...row, document: JSON.parse(row.document) as SharedSlides };
}

export class SharedSlideHistory extends DurableObject<SharedSlidesEnv> {
  constructor(ctx: DurableObjectState, env: SharedSlidesEnv) {
    super(ctx, env);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS slide_versions (
      revision INTEGER PRIMARY KEY, savedAt TEXT NOT NULL, summary TEXT NOT NULL, document TEXT NOT NULL
    )`);
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS slide_release (id INTEGER PRIMARY KEY, document TEXT NOT NULL)');
    this.applyRelease();
  }

  private applyRelease() {
    this.ctx.storage.transactionSync(() => {
      const next = committedSlides.document as SharedSlides;
      const encoded = JSON.stringify(next);
      const applied = this.ctx.storage.sql.exec<{ document: string }>('SELECT document FROM slide_release WHERE id = 1').toArray()[0]?.document;
      if (applied === encoded) return;
      const previous = applied ? JSON.parse(applied) as SharedSlides : originalSharedSnapshot.document;
      const current = this.latest();
      const document = mergeSlideEdits(current.document, previous, next);
      if (document !== current.document) {
        this.ctx.storage.sql.exec('INSERT INTO slide_versions (revision, savedAt, summary, document) VALUES (?, ?, ?, ?)',
          current.revision + 1, new Date().toISOString(), 'Published slide edits from Git', JSON.stringify(document));
      }
      this.ctx.storage.sql.exec('INSERT OR REPLACE INTO slide_release (id, document) VALUES (1, ?)', encoded);
    });
  }

  private latest(): SharedSnapshot {
    return storedResult(this.ctx.storage.sql.exec<StoredVersion>('SELECT * FROM slide_versions ORDER BY revision DESC LIMIT 1').toArray()[0]);
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const isMain = url.pathname === sharedSlidesPath;
    const editable = canEdit(request, this.env.SLIDE_EDIT_KEY);
    if (isMain && request.method === 'GET') return reply({ ...this.latest(), editable });
    if (!editable) return reply({ error: 'A valid private edit link is required.' }, 403);

    if (url.pathname === `${sharedSlidesPath}/history` && request.method === 'GET') {
      const cursor = url.searchParams.get('before');
      const before = cursor === null ? Number.MAX_SAFE_INTEGER : Number(cursor);
      if (!isRevision(before) || before === 0) return reply({ error: 'Invalid history cursor.' }, 400);
      const rows = this.ctx.storage.sql.exec<Omit<SlideVersion, 'savedAt'> & { savedAt: string }>(
        'SELECT revision, savedAt, summary FROM slide_versions WHERE revision < ? ORDER BY revision DESC LIMIT ?', before, pageLength + 1).toArray();
      const versions: SlideVersion[] = rows.slice(0, pageLength);
      const next = rows.length > pageLength ? versions.at(-1)!.revision : null;
      if (next === null) {
        const { revision, savedAt, summary } = originalSharedSnapshot;
        versions.push({ revision, savedAt, summary });
      }
      return reply({ versions, next });
    }

    const restoring = url.pathname === `${sharedSlidesPath}/restore` && request.method === 'POST';
    if (!(isMain && request.method === 'PUT') && !restoring) return reply({ error: 'Not found.' }, 404);
    if (request.headers.get('Origin') !== url.origin) return reply({ error: 'Origin not allowed.' }, 403);
    const body = await readChange(request);
    if (!body || !isRevision(body.revision)) return reply({ error: 'Invalid save request.' }, 400);

    return this.ctx.storage.transactionSync(() => {
      const current = this.latest();
      if (body.revision !== current.revision) return reply({ error: 'Someone saved a newer version. Load it before saving again.' }, 409);
      let document: SharedSlides;
      let summary: string;
      if (restoring) {
        if (!isRevision(body.target) || body.target >= current.revision) return reply({ error: 'Choose an earlier version.' }, 400);
        const version = body.target === 0 ? originalSharedSnapshot : this.version(body.target);
        if (!version) return reply({ error: 'Version not found.' }, 404);
        document = version.document;
        summary = body.target === 0 ? 'Restored the original website' : `Restored version ${body.target}`;
      } else {
        const proposed = applySharedSlideChange(body, current.document);
        if (!proposed.document) return reply({ error: proposed.error }, 400);
        ({ document, summary } = proposed);
      }

      const revision = current.revision + 1;
      const savedAt = new Date().toISOString();
      const encoded = JSON.stringify(document);
      if (new TextEncoder().encode(encoded).byteLength > 1_500_000) return reply({ error: 'This presentation version is too large to save.' }, 413);
      this.ctx.storage.sql.exec('INSERT INTO slide_versions (revision, savedAt, summary, document) VALUES (?, ?, ?, ?)', revision, savedAt, summary, encoded);
      return reply({ revision, savedAt, summary, document, editable });
    });
  }

  private version(revision: number) {
    const row = this.ctx.storage.sql.exec<StoredVersion>('SELECT * FROM slide_versions WHERE revision = ?', revision).toArray()[0];
    return row && storedResult(row);
  }
}
