"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search characters…",
  className,
}: SearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.trimStart());
    },
    [onChange]
  );

  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-codex-muted"
        aria-hidden
      />
      <input
        type="search"
        role="searchbox"
        aria-label="Search characters by name"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-codex-border bg-codex-surface py-3 pl-12 pr-4",
          "text-zinc-100 placeholder:text-codex-muted",
          "focus:border-codex-accent focus:outline-none focus:ring-1 focus:ring-codex-accent/50",
          "transition-colors duration-200"
        )}
      />
    </motion.div>
  );
}
