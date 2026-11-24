import { createCustomIcon } from "./createCustomIcon";

/**
 * A note: rounded square with three text lines of different lengths (Facelift
 * Conversas "Anotação", Figma 201:7772). Lucide's square-menu has three equal
 * lines; drawn here on lucide's grid and stroke so it sits beside them.
 */
export const NoteTextIcon = createCustomIcon("NoteTextIcon", {
  children: (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M7 8h8" />
      <path d="M7 12h10" />
      <path d="M7 16h6" />
    </g>
  ),
});
