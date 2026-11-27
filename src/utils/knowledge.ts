import { getCollection, type CollectionEntry } from 'astro:content';
import { validateKnowledgeTaxonomy } from './knowledge-validation';
import { withBase } from './url';

export type SectionEntry = CollectionEntry<'sekcjeBazyWiedzy'>;
export type TopicEntry = CollectionEntry<'tematyBazyWiedzy'>;
export type ArticleEntry = CollectionEntry<'edukacja'>;

export type KnowledgeBase = {
  sections: SectionEntry[];
  topics: TopicEntry[];
  articles: ArticleEntry[];
};

const byOrderThenTitle = (
  a: { data: { order: number; title: string } },
  b: { data: { order: number; title: string } }
) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'pl');

export async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  const [sections, topics, articles] = await Promise.all([
    getCollection('sekcjeBazyWiedzy'),
    getCollection('tematyBazyWiedzy'),
    getCollection('edukacja'),
  ]);

  const problems = validateKnowledgeTaxonomy({
    sections: sections.map((section) => ({
      id: section.id,
      title: section.data.title,
      order: section.data.order,
      kind: section.data.kind,
      href: section.data.href,
    })),
    topics: topics.map((topic) => ({
      id: topic.id,
      title: topic.data.title,
      order: topic.data.order,
      section: topic.data.section,
    })),
    articles: articles.map((article) => ({
      id: article.id,
      title: article.data.title,
      section: article.data.section,
      topic: article.data.topic,
      order: article.data.order,
      status: article.data.status,
    })),
  });

  if (problems.length > 0) {
    throw new Error(`Invalid knowledge base:\n- ${problems.join('\n- ')}`);
  }

  return {
    sections: [...sections].sort(byOrderThenTitle),
    topics: [...topics].sort(byOrderThenTitle),
    articles: [...articles].sort(byOrderThenTitle),
  };
}

export const isPublished = (article: ArticleEntry) => article.data.status === 'published';

export const topicsForSection = (topics: TopicEntry[], sectionId: string) =>
  topics.filter((topic) => topic.data.section === sectionId);

export const articlesForSection = (articles: ArticleEntry[], sectionId: string) =>
  articles.filter((article) => article.data.section === sectionId);

export const flatArticlesForSection = (articles: ArticleEntry[], sectionId: string) =>
  articles.filter((article) => article.data.section === sectionId && !article.data.topic);

export const articlesForTopic = (articles: ArticleEntry[], topicId: string) =>
  articles.filter((article) => article.data.topic === topicId);

export const findSection = (sections: SectionEntry[], sectionId: string) =>
  sections.find((section) => section.id === sectionId);

export const findTopic = (topics: TopicEntry[], topicId: string) =>
  topics.find((topic) => topic.id === topicId);

export const sectionHref = (section: SectionEntry) =>
  withBase(section.data.href ?? `/baza-wiedzy/${section.id}/`);

export const topicHref = (sectionId: string, topicId: string) =>
  withBase(`/baza-wiedzy/${sectionId}/${topicId}/`);

export const articleHref = (sectionId: string, topicId: string | undefined, articleId: string) =>
  withBase(
    topicId
      ? `/baza-wiedzy/${sectionId}/${topicId}/${articleId}/`
      : `/baza-wiedzy/${sectionId}/${articleId}/`
  );

export const sectionNumber = (index: number) => String(index + 1).padStart(2, '0');
