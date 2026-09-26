export default function SectionTitle({ eyebrow, title, subtitle, center = false }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : ""}>
      {eyebrow && (
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-dark">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
    </div>
  );
}