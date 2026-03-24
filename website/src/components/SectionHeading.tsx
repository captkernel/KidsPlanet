interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {label && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-primary-dark">{title}</h2>
      <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}
