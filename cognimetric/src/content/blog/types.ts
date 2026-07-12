export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO date
  paragraphs: string[];
}

export type BlogContent = BlogPost[];
