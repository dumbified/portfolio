import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/writing");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function getSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
}

export function getPosts(): PostMeta[] {
  const slugs = getSlugs();
  const posts = slugs
    .map((slug) => {
      const fullPath = path.join(postsDirectory, slug);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug: slug.replace(/\.md$/, ""),
        title: (data.title as string) || slug,
        date: (data.date as string) || "",
        description: data.description as string | undefined,
      };
    })
    .filter((p) => p.date)
    .sort((a, b) => (b.date.localeCompare(a.date)));
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || "",
    description: data.description as string | undefined,
    content,
  };
}
