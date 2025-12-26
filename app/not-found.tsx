import Link from "./components/link";
import BlinkingCursor from "./components/blinking-cursor";

export default function NotFound() {
  return (
    <>
      <h1 className="mb-4"> 404 - Page Not Found <BlinkingCursor /></h1>
      <Link href="/">
        return
      </Link>
    </>
  );
}