export default function NotificationsIcon({
  className,
  strokeColor = "#E7AE58",
  strokeOpacity = "0.8",
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
        d="M10.2852 22.7144H13.7137"
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M18.856 9.85714C18.856 8.03851 18.1336 6.29438 16.8476 5.00841C15.5617 3.72245 13.8175 3 11.9989 3C10.1802 3 8.43612 3.72245 7.15015 5.00841C5.86419 6.29438 5.14174 8.03851 5.14174 9.85714V15.8571C5.14174 16.5391 4.87082 17.1933 4.38859 17.6755C3.90636 18.1577 3.25229 18.4286 2.57031 18.4286H21.4275C20.7455 18.4286 20.0913 18.1577 19.6091 17.6755C19.1269 17.1933 18.856 16.5391 18.856 15.8571V9.85714Z"
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M0.857422 9.63422C0.858346 8.00246 1.24748 6.39434 1.99269 4.94268C2.73789 3.49102 3.81777 2.2375 5.14314 1.28564"
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d="M23.1431 9.63422C23.1423 8.00246 22.7531 6.39434 22.0079 4.94268C21.2627 3.49102 20.1827 2.2375 18.8574 1.28564"
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
    </svg>
  );
}
