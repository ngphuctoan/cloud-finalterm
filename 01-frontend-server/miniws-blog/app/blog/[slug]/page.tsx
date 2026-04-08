import { getBlogBySlug, getAllBlogs } from "@/lib/api";
import markdownToHtml from "@/types/markdownToHtml";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (blog === null) {
    return notFound();
  }

  const content = await markdownToHtml(blog.content || "");

  return (
    <>
      <h1>{blog.title}</h1>
      <p className="mb-2 text-body-secondary">
        {blog.date.toLocaleDateString()} by {blog.author}
      </p>
      <p>{blog.preview}</p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}
