import Link from "./link";

interface InfoProps {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export default function Info({ label, value, href, external = false }: InfoProps) {
  return (
    <div className="mb-1">
      <span>{label}:</span>{" "}
      {href ? (
        <Link href={href} external={external}>
          {value}
        </Link>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};
