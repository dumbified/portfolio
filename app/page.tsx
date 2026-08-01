import BlinkingCursor from "./components/blinking-cursor";
import Divider from "./components/divider";
import Info from "./components/info";
import Link from "./components/link";
import ProjectItem from "./components/project-item";
import AsciiSprite from "./components/ascii-sprite";
import { getPosts } from "@/lib/writing";

const GIST_URL = "https://gist.githubusercontent.com/dumbified/f01d03b5586bdb66ac6f7f6ecc71fdeb/raw/status.json";

async function getStatus() {
  try {
    const res = await fetch(GIST_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
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
      <header className="mb-2 md:mb-4">
        <h1 className="text-lg font-semibold tracking-tight">
          yee ern
          <BlinkingCursor />
        </h1>
        <p className="text-muted-foreground text-sm mt-1">cs student</p>
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
        <p className="mb-1">interested in design and modern technologies.</p>
        <p className="mb-1">previously worked at <Link href="https://vitrox.com" >ViTrox Technologies</Link>
        , building a forecast accuracy analytics dashboard for the team.</p>
      </section>
      <Divider />

      {/* Projects */}
      <section className="mb-2">
        <h2 className="font-semibold mb-2">projects:</h2>
        <ProjectItem title="Forecast accuracy analytics dashboard" href="https://github.com/dumbified/mvst"/>
      </section>

      {/* Blog */}
      {/*<Divider />
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
      </section>*/}

      <Divider />
      <AsciiSprite
          src="/joe-sprites.png"
          cols={100}
          className="mb-3 w-[280px] max-w-[85vw] md:w-[420px] md:max-w-[520px]"
        />
      <Divider />
      {/* Footer */}
      <footer>
        <p className="text-muted-foreground">status: {data.status}</p>
        <p className="text-muted-foreground">last_updated: {data.last_updated}</p>
      </footer>
    </>
  );
}
