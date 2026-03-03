import Link from "@/app/components/link";
import Divider from "@/app/components/divider";
import { getPostBySlug, getPosts } from "@/lib/writing";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import BlinkingCursor from "@/app/components/blinking-cursor";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <header className="mb-4">
        <h1 className="text-lg font-semibold tracking-tight">{post.title}<BlinkingCursor /></h1>
        <p className="text-muted-foreground text-sm mt-1">date: {post.date}</p>
        <p className="text-muted-foreground text-sm mt-1">desc: {post.description}</p>
      </header>
      <Divider />
      <article className="writing-post">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
      <Divider />
      <footer>
        <Link href="/">← back</Link>
      </footer>
    </>
  );
}
