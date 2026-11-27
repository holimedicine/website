export type KnowledgeSection = {
  id: string;
  title: string;
  order: number;
  kind: 'articles' | 'supplements';
  href?: string;
};

export type KnowledgeTopic = {
  id: string;
  title: string;
  order: number;
  section: string;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  section: string;
  topic?: string;
  order: number;
  status: 'published' | 'draft';
};

export type KnowledgeTaxonomy = {
  sections: KnowledgeSection[];
  topics: KnowledgeTopic[];
  articles: KnowledgeArticle[];
};

/**
 * Validates the editable knowledge-base tree. Called at build time so a bad
 * relationship fails with one readable list instead of a broken page.
 */
export function validateKnowledgeTaxonomy({
  sections,
  topics,
  articles,
}: KnowledgeTaxonomy): string[] {
  const problems: string[] = [];
  const sectionIds = new Set(sections.map((section) => section.id));
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const topicIds = new Set<string>();

  for (const topic of topics) {
    if (!sectionIds.has(topic.section)) {
      problems.push(
        `Temat "${topic.id}" wskazuje nieistniejącą sekcję "${topic.section}".`
      );
    }

    if (topicIds.has(topic.id)) {
      problems.push(`Temat "${topic.id}" występuje więcej niż raz.`);
    }
    topicIds.add(topic.id);
  }

  const articleIds = new Set<string>();
  for (const article of articles) {
    if (!sectionIds.has(article.section)) {
      problems.push(
        `Artykuł "${article.id}" wskazuje nieistniejącą sekcję "${article.section}".`
      );
    }

    if (articleIds.has(article.id)) {
      problems.push(`Artykuł "${article.id}" występuje więcej niż raz.`);
    }
    articleIds.add(article.id);

    if (article.topic) {
      const topic = topicById.get(article.topic);
      if (!topic) {
        problems.push(
          `Artykuł "${article.id}" wskazuje nieistniejący temat "${article.topic}".`
        );
      } else if (topic.section !== article.section) {
        problems.push(
          `Artykuł "${article.id}" należy do sekcji "${article.section}", ale temat "${article.topic}" należy do sekcji "${topic.section}".`
        );
      }
    }
  }

  for (const section of sections) {
    if (section.kind === 'supplements' && !section.href) {
      problems.push(
        `Sekcja "${section.id}" jest typu suplementy, ale nie ma pola href.`
      );
    }

    if (section.href && !section.href.startsWith('/')) {
      problems.push(
        `Sekcja "${section.id}" ma href "${section.href}", który nie zaczyna się od "/".`
      );
    }

    if (
      section.href &&
      articles.some((article) => article.section === section.id)
    ) {
      problems.push(
        `Sekcja "${section.id}" ma href, więc nie może zawierać artykułów.`
      );
    }
  }

  // Topics and flat articles share the /baza-wiedzy/<sekcja>/<slug>/ route.
  const flatArticleIdsBySection = new Map<string, Set<string>>();
  for (const article of articles) {
    if (article.topic) continue;

    const ids = flatArticleIdsBySection.get(article.section) ?? new Set<string>();
    ids.add(article.id);
    flatArticleIdsBySection.set(article.section, ids);
  }

  for (const topic of topics) {
    if (flatArticleIdsBySection.get(topic.section)?.has(topic.id)) {
      problems.push(
        `Temat "${topic.id}" koliduje ze slugiem artykułu w sekcji "${topic.section}".`
      );
    }
  }

  return problems;
}
