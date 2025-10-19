import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18 2H6C4.9 2 4 2.9 4 4V14C4 16.97 6.16 19.54 9 20.49V22H15V20.49C17.84 19.54 20 16.97 20 14V4C20 2.9 19.1 2 18 2ZM8.5 12.5C7.67 12.5 7 11.83 7 11S7.67 9.5 8.5 9.5 10 10.17 10 11S9.33 12.5 8.5 12.5ZM15.5 12.5C14.67 12.5 14 11.83 14 11S14.67 9.5 15.5 9.5 17 10.17 17 11S16.33 12.5 15.5 12.5Z" />
    </svg>
  );
}
