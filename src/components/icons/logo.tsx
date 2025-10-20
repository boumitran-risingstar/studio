import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "rgb(0, 255, 150)", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "rgb(0, 150, 255)", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logo-gradient)"
        d="M4 20h2v-7h-2v7zm4 0h2v-9h-2v9zm4 0h2v-12h-2v12zm8.41-8.59l-1.41-1.41L18 10.59V4h-2v7.59l-2.41-2.42-1.41 1.41L15.59 14H17v-1.59l2-2L20.41 9l-1-1 1.59-1.59zM15 20c-2.76 0-5-2.24-5-5s2.24-5 5-5v1c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4h1c0 2.76-2.24 5-5 5z"
      />
    </svg>
  );
}