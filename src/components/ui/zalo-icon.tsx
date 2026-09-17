type ZaloIconProps = {
  className?: string;
};

export function ZaloIcon({ className }: ZaloIconProps) {
  return (
    <svg
      viewBox="0 0 54 20"
      className={className}
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.4 0h12.9v3.2L5.9 15.4h8.7V19H0.9v-3.2L9.3 3.6H1.4z" />
      <path d="M23.4 5.1c1.7 0 3.2 0.6 4.2 1.6V5.4h3.4V19h-3.4v-1.3c-1 1-2.5 1.6-4.2 1.6-3.7 0-6.6-3.1-6.6-7.1s2.9-7.1 6.6-7.1zm0.5 3.4c-2 0-3.6 1.6-3.6 3.7s1.6 3.7 3.6 3.7 3.7-1.6 3.7-3.7-1.7-3.7-3.7-3.7z" />
      <path d="M33.2 0h3.5v19h-3.5z" />
      <path d="M45.8 5.1c3.9 0 7 3.2 7 7.1s-3.1 7.1-7 7.1-7-3.2-7-7.1 3.1-7.1 7-7.1zm0 3.4c-2 0-3.6 1.6-3.6 3.7s1.6 3.7 3.6 3.7 3.6-1.6 3.6-3.7-1.6-3.7-3.6-3.7z" />
    </svg>
  );
}
