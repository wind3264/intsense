"use client";

import { useEffect, useId, useRef, useState } from "react";

// Multi-select for tags: type to narrow the list, click or press Enter to toggle one.
// Selected tags sit under the box as removable chips.
export function TagPicker({
  tags,
  selected,
  onChange,
}: {
  tags: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const matches = tags.filter((t) => t.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!open) return;
    function close(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function toggle(tag: string) {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (matches.length > 0) {
        const step = e.key === "ArrowDown" ? 1 : -1;
        setActive((Math.min(active, matches.length - 1) + step + matches.length) % matches.length);
      }
    } else if (e.key === "Enter" && open && matches[active]) {
      e.preventDefault();
      toggle(matches[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={root}
      className="relative"
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <input
        className="field w-full"
        role="combobox"
        aria-label="Search tags"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={selected.length === 0 ? "Any tag - search to choose" : "Search tags"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-border bg-background py-1 shadow-lg"
        >
          {matches.length === 0 && <li className="px-3 py-1.5 text-muted">No tags match.</li>}
          {matches.map((tag, i) => (
            <li
              key={tag}
              role="option"
              aria-selected={selected.includes(tag)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5 ${
                i === active ? "bg-subtle" : ""
              }`}
              // Keep focus in the search box so typing can continue after a click.
              onPointerDown={(e) => e.preventDefault()}
              onPointerEnter={() => setActive(i)}
              onClick={() => toggle(tag)}
            >
              {tag}
              {selected.includes(tag) && <span className="text-accent">✓</span>}
            </li>
          ))}
        </ul>
      )}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <button
              key={tag}
              className="rounded border border-accent bg-subtle px-2 py-1 text-xs text-accent"
              aria-label={`Remove ${tag}`}
              onClick={() => toggle(tag)}
            >
              {tag} <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
