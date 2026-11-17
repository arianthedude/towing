import type { ReactNode } from "react";
import "./globals.css";

/** Root shell — locale-specific html attrs live in [locale]/layout. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
