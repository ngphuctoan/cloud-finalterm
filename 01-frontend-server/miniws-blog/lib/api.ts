import { Blog } from "@/types/blog";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const blogDir = path.join(process.cwd(), "blogs");

export function getBlogSlugs() {
  return fs.readdirSync(blogDir);
}

export function getBlogBySlug(slug: string): Blog | null {
  try {
    const realSlug = slug.replace(/.md$/, "");
    const fullPath = path.join(blogDir, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContents);
    return { ...data, slug: realSlug, content } as Blog;
  } catch {
    return null;
  }
}

export function getAllBlogs(): Blog[] {
  const slugs = getBlogSlugs();
  const blogs = slugs
    .map((slug) => getBlogBySlug(slug) as Blog)
    .sort((post1, post2) => (post1!.date > post2!.date ? -1 : 1));
  return blogs;
}
