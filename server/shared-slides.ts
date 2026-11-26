import { DurableObject } from 'cloudflare:workers';
import { parseLayout } from '../src/layout-data';
import { authoredCues, customCueKeyPattern, customCueNumber, editableCueSequence, joinOpeningInkEdits, maxAddedCues, openingClassroomScene } from '../src/classroom-cues';
import { cleanSlideCopy, editKeyPattern, isDialogueText, isRevision, isSlideCopy, originalSharedSnapshot, sharedSlideByKey, sharedSlidesPath,
  type AddedDialogueLine, type DialogueCopy, type DialogueStructure, type SharedSlides, type SharedSnapshot, type SlideVersion } from '../src/shared-slide-data';

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

function dialogueStructure(scene: string, input: Record<string, unknown>, structures?: Record<string, DialogueStructure>) {
  const previous = structures?.[scene];
  const authored = authoredCues(scene);
  const known = new Set(authored.map(cue => cue.key));
  const added = [...(previous?.added ?? [])];
  const removed = new Set(previous?.removed);
  const wire = new Set(added.map(cue => customCueNumber(cue.key)));
  const otherKeys = new Set(Object.entries(structures ?? {}).flatMap(([id, edit]) => id === scene ? [] : edit.added.map(cue => cue.key)));
  for (const cue of added) known.add(cue.key);
  const { added: inserts = [], removed: deletes = [] } = input;
  if (!Array.isArray(inserts) || !Array.isArray(deletes) || deletes.length > known.size ||
      (inserts.length > 0 && added.length + inserts.length > maxAddedCues) || ((inserts.length || deletes.length) && !editableCueSequence(scene))) return null;
  for (const item of inserts as Partial<AddedDialogueLine>[]) {
    if (!item || typeof item.key !== 'string' || !customCueKeyPattern.test(item.key) || known.has(item.key) || otherKeys.has(item.key) ||
        wire.has(customCueNumber(item.key)) || !isDialogueText(item.text) ||
        (item.after !== null && (typeof item.after !== 'string' || !known.has(item.after)))) return null;
    known.add(item.key);
    wire.add(customCueNumber(item.key));
    added.push({ key: item.key, after: item.after, text: item.text });
  }
  for (const key of deletes) {
    if (typeof key !== 'string' || !known.has(key)) return null;
    removed.add(key);
  }
  const quiz = input.quizAfter;
  if (quiz !== undefined && (scene !== openingClassroomScene ||
      (quiz !== null && (typeof quiz !== 'string' || !known.has(quiz) || removed.has(quiz))))) return null;
  const quizAfter = quiz !== undefined ? quiz : previous?.quizAfter;
  return { known, removed, added, quizAfter, changed: Boolean(inserts.length || deletes.length || quiz !== undefined) };
}

function proposedDialogue(body: Record<string, unknown>, previous: SharedSlides) {
  const { scene, lines, copy } = body;
  if (typeof scene !== 'string' || !lines || typeof lines !== 'object' || Array.isArray(lines)) return null;
  const structures = joinOpeningInkEdits(previous.dialogueStructure);
  const structure = dialogueStructure(scene, body, structures);
  if (!structure) return null;
  const changes = Object.entries(lines);
  if (changes.length > 200 || changes.some(([key, text]) => !structure.known.has(key) || structure.removed.has(key) || !isDialogueText(text))) return null;
  const panel = copy as Partial<DialogueCopy> | undefined;
  const entry = panel && typeof panel.key === 'string' ? sharedSlideByKey.get(panel.key) : undefined;
  if (copy !== undefined && (!entry?.panel || entry.slideId !== scene || !isSlideCopy(panel?.copy))) return null;
  if (!changes.length && copy === undefined && !structure.changed) return null;
  let document = previous;
  if (entry && panel?.copy) {
    document = { ...document, copy: { ...document.copy, [entry.key]: cleanSlideCopy(panel.copy) } };
  }
  if (changes.length) document = { ...document, dialogue: { ...document.dialogue, ...Object.fromEntries(changes) } };
  if (structure.changed) {
    const { added, removed, quizAfter } = structure;
    document = { ...document, dialogueStructure: { ...structures, [scene]: { added, removed: [...removed], quizAfter } } };
  }
  return document;
}

function proposedLayout(value: unknown) {
  const layout = parseLayout(JSON.stringify(value) ?? null);
  if (!layout) return null;
  const entries = Object.entries(layout.items);
  const input = (value as { items: object }).items;
  if (entries.length !== Object.keys(input).length || entries.length > 300 ||
      Math.abs(layout.view.x) > 1e6 || Math.abs(layout.view.y) > 1e6 ||
      entries.some(([key, item]) => !/^[a-zA-Z0-9_-]{1,120}$/.test(key) || Math.abs(item.x) > 1e6 || Math.abs(item.y) > 1e6)) return null;
  return { ...layout, savedAt: new Date().toISOString() };
}

export class SharedSlideHistory extends DurableObject<SharedSlidesEnv> {
  constructor(ctx: DurableObjectState, env: SharedSlidesEnv) {
    super(ctx, env);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS slide_versions (
      revision INTEGER PRIMARY KEY, savedAt TEXT NOT NULL, summary TEXT NOT NULL, document TEXT NOT NULL
    )`);
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
      } else if (body.type === 'copy' && typeof body.key === 'string' && isSlideCopy(body.copy)) {
        const entry = sharedSlideByKey.get(body.key);
        if (!entry) return reply({ error: 'Unknown slide.' }, 400);
        const copy = cleanSlideCopy(body.copy);
        document = { ...current.document, copy: { ...current.document.copy, [body.key]: copy } };
        summary = `Edited ${entry.label}`;
      } else if (body.type === 'dialogue') {
        const updated = proposedDialogue(body, current.document);
        if (!updated) return reply({ error: 'Invalid dialogue edit.' }, 400);
        document = updated;
        const scene = [...sharedSlideByKey.values()].find(entry => entry.slideId === body.scene);
        summary = `Edited dialogue · ${scene?.label ?? body.scene}`;
      } else if (body.type === 'layout') {
        const layout = proposedLayout(body.layout);
        if (!layout) return reply({ error: 'The canvas layout is invalid.' }, 400);
        document = { ...current.document, layout };
        summary = 'Edited the canvas layout';
      } else return reply({ error: 'Invalid slide content.' }, 400);

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
