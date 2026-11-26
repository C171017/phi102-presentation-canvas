export type LegacySlideCopy = { title: string; claim: string; points: string[]; bridge: string; source: string };
export type SlideSection =
  | { kind: 'header'; title: string; source: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'heading' | 'text' | 'cue'; text: string };
export type SlideCopy = LegacySlideCopy | { sections: SlideSection[] };

export const maxSlideSections = 24;
export const maxSectionBullets = 12;
const fits = (value: unknown, length: number): value is string => typeof value === 'string' && value.length <= length;
const filled = (value: unknown, length: number): value is string => fits(value, length) && Boolean(value.trim());
const bulletList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length <= maxSectionBullets && value.every(item => filled(item, 500));

function isSlideSection(value: unknown): value is SlideSection {
  if (!value || typeof value !== 'object') return false;
  const section = value as Record<string, unknown>;
  switch (section.kind) {
    case 'header': return fits(section.title, 150) && fits(section.source, 180) && Boolean(section.title.trim() || section.source.trim());
    case 'bullets': return bulletList(section.items) && section.items.length > 0;
    case 'heading': case 'text': case 'cue': return filled(section.text, 500);
    default: return false;
  }
}

export function isSlideCopy(value: unknown): value is SlideCopy {
  if (!value || typeof value !== 'object') return false;
  if ('sections' in value) return Array.isArray(value.sections) && value.sections.length <= maxSlideSections && value.sections.every(isSlideSection);
  const { title, claim, points, bridge, source } = value as Partial<LegacySlideCopy>;
  return filled(title, 150) && filled(claim, 500) && bulletList(points) && fits(bridge, 500) && fits(source, 180);
}

export function slideSections(copy: SlideCopy): SlideSection[] {
  if ('sections' in copy) return copy.sections;
  const { title, claim, points, bridge, source } = copy;
  const sections: SlideSection[] = [];
  if (title || source) sections.push({ kind: 'header', title, source });
  if (claim) sections.push({ kind: 'heading', text: claim });
  if (points.length) sections.push({ kind: 'bullets', items: points });
  if (bridge) sections.push({ kind: 'cue', text: bridge });
  return sections;
}

export function cleanSlideCopy(copy: SlideCopy): SlideCopy {
  if ('sections' in copy) {
    return { sections: copy.sections.map(section => {
      switch (section.kind) {
        case 'header': return { kind: 'header', title: section.title, source: section.source };
        case 'bullets': return { kind: 'bullets', items: [...section.items] };
        default: return { kind: section.kind, text: section.text };
      }
    }) };
  }
  const { title, claim, points, bridge, source } = copy;
  return { title, claim, points, bridge, source };
}
