"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail on unsupported browsers
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" /> Copied
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" /> {label}
        </>
      )}
    </button>
  );
}
