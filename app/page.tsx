import BlinkingCursor from "./components/blinking-cursor";
import Divider from "./components/divider";
import Info from "./components/info";
import Link from "./components/link";
import ProjectItem from "./components/project-item";
import { getPosts } from "@/lib/writing";

const GIST_URL = "https://gist.githubusercontent.com/dumbified/f01d03b5586bdb66ac6f7f6ecc71fdeb/raw/status.json";

async function getStatus() {
  try {
    const res = await fetch(GIST_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return res.json();
  } catch (e) {
    return { 
      status: "full-time student", 
      last_updated: "2025-12",
      resume_url: "/resume.pdf",
    };
  }
}

export default async function Home() {
  const data = await getStatus();
  const resumeHref = data.resume_url || "/resume.pdf";
  const recentPosts = getPosts().slice(0, 3);

  return (
    <>
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-lg font-semibold tracking-tight">
          yee ern
          <BlinkingCursor />
        </h1>
      </header>
      <Divider />

      {/* Info */}
      <section className="mb-2">
        <Info
          label="EMAIL"
          value="yern.goh@gmail.com"
          href="mailto:yern.goh@gmail.com"
        />
        <Info label="LOCATION" value="Penang, MY" />
        <Info
          label="GITHUB"
          value="github.com/dumbified"
          href="https://github.com/dumbified"
          external
        />
        <Info label="RESUME" value="resume.pdf" href={resumeHref} external />
      </section>
      <Divider />

      {/* About */}
      <section className="mb-2">
        <h2 className="font-semibold mb-2">about:</h2>
        <p className="mb-1">a computer science student interested in design and modern technologies.</p>
        <p className="mb-1 italic">less is more. ☉ ‿ ⚆</p>
      </section>
      <Divider />

      {/* Projects */}
      <section className="mb-2">
        <h2 className="font-semibold mb-2">projects:</h2>
        <ProjectItem title="Portfolio" href="/" description="this website" />
        <ProjectItem title="Forecast accuracy dashboard" href="https://github.com/dumbified/mvst" description="an internal analytics dashboard for ViTrox, used to track & measure the actual shipment of machines against the forecasted quantity"/>
      </section>
      <Divider />

      {/* Blog */}
      <section className="mb-2">
        <h2 className="font-semibold mb-2">writing:</h2>
        {recentPosts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : ( 
          <>
            {recentPosts.map((post) => (
              <div key={post.slug} className="mb-1 flex flex-wrap items-baseline gap-x-2">
                <span className="select-none">- </span>
                <Link href={`/writing/${post.slug}`}>{post.title}</Link>
              </div>
            ))}
          </>
        )}
      </section>

      <Divider />
      {/* Footer */}
      <footer>
        <p className="text-muted-foreground">status: {data.status}</p>
        <p className="text-muted-foreground">last_updated: {data.last_updated}</p>
      </footer>
    </>
  );
}
