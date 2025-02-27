export default function EventsIcon({
  className,
  strokeColor = "#A34CE9",
  strokeLinecap = "round",
  strokeLinejoin = "round",
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.57171 3.42822C2.11704 3.42822 1.68102 3.60884 1.35952 3.93032C1.03803 4.25182 0.857422 4.68785 0.857422 5.14251V21.4282C0.857422 21.8829 1.03803 22.319 1.35952 22.6404C1.68102 22.9618 2.11704 23.1425 2.57171 23.1425H21.4289C21.8835 23.1425 22.3196 22.9618 22.641 22.6404C22.9625 22.319 23.1431 21.8829 23.1431 21.4282V5.14251C23.1431 4.68785 22.9625 4.25182 22.641 3.93032C22.3196 3.60884 21.8835 3.42822 21.4289 3.42822H18.0003"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M0.857422 9.42822H23.1431"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M6 0.856934V5.99979"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M18 0.856934V5.99979"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M6 3.42822H14.5714"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
    </svg>
  );
}
