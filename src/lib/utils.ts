import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStars(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return String(n);
}

export function formatRelative(iso: string): string {
  if (!iso) return "unknown";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  const now = new Date();
  const days = Math.floor((now.getTime() - dt.getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function slugify(repo: string): string {
  return repo.replace("/", "--").toLowerCase();
}
