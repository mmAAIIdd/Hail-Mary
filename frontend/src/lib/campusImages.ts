export interface CampusImage {
  url: string;
  sourceUrl: string;
  caption: string;
  author: string;
  license: string;
}

const cache = new Map<string, Promise<CampusImage | null>>();

function normalized(value: string): string {
  return value.toLocaleLowerCase('en').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function isAllowedUrl(value: unknown, hosts: string[]): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && hosts.includes(url.hostname);
  } catch {
    return false;
  }
}

function plainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return new DOMParser().parseFromString(value, 'text/html').body.textContent?.trim().slice(0, 180) ?? '';
}

async function fetchJson(url: URL): Promise<unknown> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, { signal: controller.signal, credentials: 'omit' });
    if (!response.ok) return null;
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function findCampusImage(name: string): Promise<CampusImage | null> {
  const searchUrl = new URL('https://www.wikidata.org/w/api.php');
  searchUrl.search = new URLSearchParams({ action: 'wbsearchentities', search: name, language: 'en', format: 'json', limit: '5', origin: '*' }).toString();
  const search = await fetchJson(searchUrl) as { search?: Array<{ id?: string; label?: string; description?: string }> } | null;
  const match = search?.search?.find((item) =>
    /^Q\d+$/.test(item.id ?? '')
    && normalized(item.label ?? '') === normalized(name)
    && /university|college|institute|school/i.test(item.description ?? ''),
  );
  if (!match?.id) return null;

  const entityUrl = new URL('https://www.wikidata.org/w/api.php');
  entityUrl.search = new URLSearchParams({ action: 'wbgetentities', ids: match.id, props: 'claims', format: 'json', origin: '*' }).toString();
  const entity = await fetchJson(entityUrl) as { entities?: Record<string, { claims?: { P18?: Array<{ mainsnak?: { datavalue?: { value?: unknown } } }> } }> } | null;
  const filenames = entity?.entities?.[match.id]?.claims?.P18?.map((claim) => claim.mainsnak?.datavalue?.value).filter((value): value is string => typeof value === 'string') ?? [];

  for (const filename of filenames.slice(0, 3)) {
    if (!/\.(jpe?g|png|webp)$/i.test(filename) || /logo|seal|crest|coat.of.arms|emblem|flag|map|diagram/i.test(filename)) continue;
    const imageUrl = new URL('https://commons.wikimedia.org/w/api.php');
    imageUrl.search = new URLSearchParams({ action: 'query', format: 'json', prop: 'imageinfo', titles: `File:${filename}`, iiprop: 'url|mime|extmetadata', iiurlwidth: '960', origin: '*' }).toString();
    const response = await fetchJson(imageUrl) as { query?: { pages?: Record<string, { title?: string; imageinfo?: Array<{ thumburl?: unknown; descriptionurl?: unknown; mime?: string; extmetadata?: Record<string, { value?: unknown }> }> }> } } | null;
    const page = Object.values(response?.query?.pages ?? {})[0];
    const info = page?.imageinfo?.[0];
    if (!info || !['image/jpeg', 'image/png', 'image/webp'].includes(info.mime ?? '')) continue;
    if (!isAllowedUrl(info.thumburl, ['thumb.wikimedia.org', 'upload.wikimedia.org']) || !isAllowedUrl(info.descriptionurl, ['commons.wikimedia.org'])) continue;
    return {
      url: info.thumburl,
      sourceUrl: info.descriptionurl,
      caption: page.title?.replace(/^File:/, '').replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ').slice(0, 150) || name,
      author: plainText(info.extmetadata?.Artist?.value) || 'Автор указан в источнике',
      license: plainText(info.extmetadata?.LicenseShortName?.value) || 'Условия использования — в источнике',
    };
  }
  return null;
}

export function getCampusImage(name: string): Promise<CampusImage | null> {
  const key = normalized(name);
  if (!key || key.length > 160) return Promise.resolve(null);
  if (!cache.has(key)) cache.set(key, findCampusImage(name).catch(() => null));
  return cache.get(key)!;
}
