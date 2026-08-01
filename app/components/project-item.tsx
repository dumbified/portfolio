import Link from "./link";

interface ProjectItemProps {
  title: string;
  description?: string;
  href?: string;
  tech?: string[];
  external?: boolean;
}

export default function ProjectItem({ title, description, href, tech, external = true }: ProjectItemProps) {
  return (
    <div className="mb-1">
      <div className="flex items-start">
        <span className="mr-2 select-none">-</span>
        <div>
          {href ? (
            <Link href={href} external={external}>
              {title}
            </Link>
          ) : (
            <span>{title}</span>
          )}
          {description && (
            <span> — {description}</span>
          )}
        </div>
      </div>
    </div>
  );
}
