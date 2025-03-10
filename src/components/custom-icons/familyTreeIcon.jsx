export default function FamilyTreeIcon({
  className,
  strokeColor = "#E7AE58",
  strokeLinecap = "round",
  strokeLinejoin = "round",
}) {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.57812 13V10.3333C2.57812 9.97971 2.72401 9.64057 2.98368 9.39052C3.24336 9.14048 3.59555 9 3.96279 9H15.0401C15.4073 9 15.7596 9.14048 16.0192 9.39052C16.2788 9.64057 16.4248 9.97971 16.4248 10.3333V13"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M9.5 5V13"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.42188 2.33333V3.66667C7.42188 4.40304 8.04176 5 8.80641 5H10.1909C10.9556 5 11.5755 4.40304 11.5755 3.66667V2.33333C11.5755 1.59696 10.9556 1 10.1909 1H8.80641C8.04176 1 7.42188 1.59696 7.42188 2.33333Z"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M7.42188 14.3333V15.6667C7.42188 16.4031 8.04176 17 8.80641 17H10.1909C10.9556 17 11.5755 16.4031 11.5755 15.6667V14.3333C11.5755 13.5969 10.9556 13 10.1909 13H8.80641C8.04176 13 7.42188 13.5969 7.42188 14.3333Z"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M0.5 14.3333V15.6667C0.5 16.4031 1.11988 17 1.88454 17H3.26907C4.03373 17 4.65361 16.4031 4.65361 15.6667V14.3333C4.65361 13.5969 4.03373 13 3.26907 13H1.88454C1.11988 13 0.5 13.5969 0.5 14.3333Z"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M14.3438 14.3333V15.6667C14.3438 16.4031 14.9636 17 15.7283 17H17.1128C17.8775 17 18.4974 16.4031 18.4974 15.6667V14.3333C18.4974 13.5969 17.8775 13 17.1128 13H15.7283C14.9636 13 14.3438 13.5969 14.3438 14.3333Z"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
    </svg>
  );
}
