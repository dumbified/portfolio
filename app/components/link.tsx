interface LinkProps {
    href: string;
    children: React.ReactNode;
    external?: boolean;
  }
  
export default function Link({ href, children, external = false }: LinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-link hover:text-link-hover underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}