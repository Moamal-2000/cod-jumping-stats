"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

function TransitionLink({ href, children, onClick, ...props }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      style={{ ...props.style }}
      onClick={(event) => {
        onClick?.(event);
        if (pathname === href) {
          event.preventDefault();
        }
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

export default TransitionLink;
