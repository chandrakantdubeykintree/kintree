export default function KincoinsIcon({
  className,
  strokeColor = "#E75858",
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
        d="M16.2859 14.5712C20.0729 14.5712 23.143 11.5012 23.143 7.71408C23.143 3.92698 20.0729 0.856934 16.2859 0.856934C12.4988 0.856934 9.42871 3.92698 9.42871 7.71408C9.42871 11.5012 12.4988 14.5712 16.2859 14.5712Z"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M16.2861 9.42857V6"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M0.857422 18.8569L5.04667 22.3479C5.66284 22.8615 6.43953 23.1426 7.24159 23.1426H18.2861C19.075 23.1426 19.7146 22.503 19.7146 21.7141C19.7146 20.1361 18.4354 18.8569 16.8574 18.8569H9.17906"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M6.00028 17.1426L7.28599 18.4284C7.99607 19.1384 9.14735 19.1384 9.85742 18.4284C10.5675 17.7183 10.5675 16.567 9.85742 15.8569L7.86163 13.8611C7.21864 13.2182 6.34658 12.8569 5.43726 12.8569H0.857422"
        stroke={strokeColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
    </svg>
  );
}
