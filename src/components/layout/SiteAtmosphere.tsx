export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <span className="ambient-gradient" />
      <span className="ambient-wash ambient-wash-left" />
      <span className="ambient-wash ambient-wash-right" />
      <span className="ambient-halo" />
      {[
        ["6%", "18%"],
        ["14%", "66%"],
        ["88%", "25%"],
        ["95%", "74%"],
        ["80%", "92%"],
        ["22%", "9%"],
      ].map(([left, top], index) => (
        <span
          key={index}
          className="ambient-spark"
          style={{ left, top, animationDelay: `${index * -2.3}s` }}
        />
      ))}
    </div>
  );
}
