"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mt-4 flex items-center justify-between rounded-2xl glass-panel px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">🔥</span>
            <span className="font-display tracking-wide text-sm sm:text-base font-semibold text-[#FFD9A8] uppercase">
              Aura Inspector
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className="relative px-3 sm:px-4 py-2 rounded-lg">
                  <span
                    className={`font-display text-xs sm:text-sm uppercase tracking-wider transition-colors ${
                      active ? "text-flame" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-2 right-2 -bottom-0.5 h-[2px] bg-flame rounded-full glow-flame"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
