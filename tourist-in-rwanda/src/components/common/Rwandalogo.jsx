function RwandaLogo() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Circle background */}
      <circle cx="32" cy="32" r="30" fill="#0F766E" />
      <circle cx="32" cy="32" r="30" stroke="#FACC15" strokeWidth="3" />

      {/* Sun (yellow) */}
      <circle cx="32" cy="24" r="7" fill="#FACC15" />

      {/* Hills (layered) */}
      <path
        d="M4 42 Q18 28 32 40 Q46 52 60 38 L60 56 Q32 60 4 56 Z"
        fill="#065F46"
      />
      <path
        d="M4 48 Q20 38 36 46 Q50 52 60 46 L60 58 Q32 62 4 58 Z"
        fill="#052E2B"
      />

      {/* Star accent */}
      <path
        d="M52 14 L54 20 L60 20 L55 24 L57 30 L52 26 L47 30 L49 24 L44 20 L50 20 Z"
        fill="#FACC15"
      />
    </svg>
  );
}