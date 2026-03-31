import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
