const PATHS = {
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </>
  ),
  "ball-tee": (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M9.5 11.5l-2 9" />
      <path d="M14.5 11.5l2 9" />
      <path d="M8 20.5h8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  phone: (
    <>
      <path d="M5.5 4.5h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A14 14 0 014.5 6.5a2 2 0 011-2z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.5" y="9" width="19" height="6" rx="1" transform="rotate(-12 12 12)" />
      <path d="M6 11v2M9 10.5v2.5M12 10v3M15 9.5v2.5M18 9v2" />
    </>
  ),
  difficulty: (
    <>
      <path d="M4 18v-3" />
      <path d="M10 18v-7" />
      <path d="M16 18v-11" />
      <path d="M22 18V4" />
    </>
  ),
  check: (
    <>
      <path d="M5 12.5l4.5 4.5L19.5 7" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
};

export default function Icon({ name, size = 24, strokeWidth = 1.5, className }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
