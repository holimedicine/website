import {
  buildSnippet,
  prepareSearchEntries,
  queryTokens,
  searchEntries,
  type PreparedSearchEntry,
  type SearchEntry,
  type SearchEntryType,
  type SnippetPart,
} from '../utils/search-text';

const GROUP_ORDER: SearchEntryType[] = ['przepis', 'edukacja', 'produkt'];

const GROUP_LABELS: Record<SearchEntryType, string> = {
  przepis: 'Przepisy',
  edukacja: 'Materiały edukacyjne',
  produkt: 'Polecane produkty',
};

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 30;

function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function renderParts(target: HTMLElement, parts: SnippetPart[]): void {
  for (const part of parts) {
    if (part.match) {
      const mark = document.createElement('mark');
      mark.textContent = part.text;
      target.append(mark);
    } else {
      target.append(document.createTextNode(part.text));
    }
  }
}

function createResult(entry: PreparedSearchEntry, tokens: string[]): HTMLLIElement {
  const item = document.createElement('li');

  const link = document.createElement('a');
  link.className = 'search-result';
  link.href = entry.url;

  const title = document.createElement('span');
  title.className = 'search-result-title';
  renderParts(title, buildSnippet(entry.title, tokens, { radius: 999 }));

  const summaryParts = entry.summary ? buildSnippet(entry.summary, tokens) : [];
  const hasSummaryMatch = summaryParts.some((part) => part.match);
  const textParts = buildSnippet(entry.text, tokens, { radius: 10 });
  const hasTextMatch = textParts.some((part) => part.match);

  // Prefer a highlighted body fragment; otherwise fall back to the summary so
  // metadata-only entries still show a useful description.
  const snippetParts =
    hasSummaryMatch || !hasTextMatch
      ? entry.summary
        ? summaryParts
        : textParts
      : textParts;

  const snippet = document.createElement('span');
  snippet.className = 'search-result-snippet';
  renderParts(snippet, snippetParts);

  const arrow = document.createElement('span');
  arrow.className = 'search-result-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';

  link.append(title, snippet, arrow);
  item.append(link);

  return item;
}

function renderResults(
  panel: HTMLElement,
  status: HTMLElement,
  results: PreparedSearchEntry[],
  tokens: string[],
  query: string
): void {
  panel.replaceChildren();

  if (results.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = `Nie znaleziono wyników dla „${query}”. Spróbuj innego słowa lub krótszej frazy.`;
    panel.append(empty);
    status.textContent = `Brak wyników dla „${query}”.`;
    return;
  }

  status.textContent = `Znaleziono ${results.length} ${pluralize(
    results.length,
    'wynik',
    'wyniki',
    'wyników'
  )}.`;

  for (const type of GROUP_ORDER) {
    const groupEntries = results.filter((entry) => entry.type === type);
    if (groupEntries.length === 0) continue;

    const group = document.createElement('section');
    group.className = 'search-group';

    const heading = document.createElement('h2');
    heading.className = 'search-group-title';
    heading.textContent = GROUP_LABELS[type];

    const count = document.createElement('span');
    count.className = 'search-group-count';
    count.textContent = String(groupEntries.length);
    heading.append(count);

    const list = document.createElement('ul');
    list.className = 'search-results';
    for (const entry of groupEntries) {
      list.append(createResult(entry, tokens));
    }

    group.append(heading, list);
    panel.append(group);
  }
}

function initSearch(form: HTMLFormElement): void {
  const input = form.querySelector<HTMLInputElement>('[data-search-input]');
  const clearButton = form.querySelector<HTMLButtonElement>('[data-search-clear]');
  const hint = form.querySelector<HTMLElement>('[data-search-hint]');
  const status = form.querySelector<HTMLElement>('[data-search-status]');
  const panel = form.querySelector<HTMLElement>('[data-search-panel]');
  const indexUrl = form.dataset.indexUrl;

  if (!input || !clearButton || !hint || !status || !panel || !indexUrl) return;

  const defaultHint = hint.textContent ?? '';
  let prepared: PreparedSearchEntry[] | null = null;
  let loadFailed = false;
  let pendingLoad: Promise<void> | null = null;
  let renderId = 0;

  const loadIndex = async (): Promise<void> => {
    if (prepared || loadFailed) return;

    if (!pendingLoad) {
      pendingLoad = fetch(indexUrl, { headers: { Accept: 'application/json' } })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json() as Promise<{ entries: SearchEntry[] }>;
        })
        .then((data) => {
          prepared = prepareSearchEntries(data.entries);
        })
        .catch(() => {
          loadFailed = true;
        })
        .finally(() => {
          pendingLoad = null;
        });
    }

    await pendingLoad;
  };

  const syncUrl = (query: string): void => {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const showLoadError = (): void => {
    panel.replaceChildren();
    const message = document.createElement('p');
    message.className = 'search-empty';
    message.textContent = 'Nie udało się wczytać wyszukiwarki. Odśwież stronę i spróbuj ponownie.';
    panel.append(message);
    status.textContent = '';
  };

  const update = async (): Promise<void> => {
    const query = input.value.trim();
    syncUrl(query);

    clearButton.hidden = input.value.length === 0;

    if (query.length < MIN_QUERY_LENGTH) {
      panel.hidden = true;
      panel.replaceChildren();
      status.textContent = '';
      hint.textContent =
        input.value.length > 0
          ? 'Wpisz co najmniej 2 znaki, aby zobaczyć wyniki.'
          : defaultHint;
      return;
    }

    hint.textContent = '';
    panel.hidden = false;

    if (!prepared) {
      const currentRender = ++renderId;
      status.textContent = 'Wczytywanie…';
      await loadIndex();
      if (currentRender !== renderId) return;

      if (!prepared) {
        showLoadError();
        return;
      }
    }

    renderResults(panel, status, searchEntries(prepared, query, MAX_RESULTS), queryTokens(query), query);
  };

  const clear = (): void => {
    input.value = '';
    void update();
    input.focus();
  };

  clearButton.addEventListener('click', clear);

  input.addEventListener('input', () => {
    void update();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && input.value.length > 0) {
      event.preventDefault();
      clear();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    input.blur();
    void update();
  });

  const initialQuery = new URLSearchParams(window.location.search).get('q') ?? '';
  input.value = initialQuery;
  void update();
}

const form = document.querySelector<HTMLFormElement>('[data-search-root]');
if (form) initSearch(form);
