"use client";

import type {
  KeyboardEvent,
  MouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@/components/icons.v2";
import { cn } from "@/lib/utils";
import { IconButton } from "../IconButton";
import { MediaThumbnail, type MediaThumbnailProps } from "../MediaThumbnail";

const DRAG_THRESHOLD_PX = 4;
const SELECT_BUTTON_SELECTOR = '[data-slot="media-thumbnail-select"]';
const REMOVE_BUTTON_SELECTOR = '[data-slot="media-thumbnail-remove"]';

export interface MediaTrayItem
  extends Omit<
    MediaThumbnailProps,
    "index" | "onRemove" | "onSelect" | "selected"
  > {
  id: string;
}

export interface MediaTrayProps {
  items: MediaTrayItem[];
  onReorder?: (nextItems: MediaTrayItem[]) => void;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedId?: string;
  onAdd?: () => void;
  /** The add button is disabled once `items.length` reaches this value */
  maxItems?: number;
  addLabel?: string;
  disabled?: boolean;
  className?: string;
}

interface DragState {
  id: string;
  from: number;
  to: number;
  startX: number;
  dragging: boolean;
}

export function moveItem<T>(
  items: readonly T[],
  from: number,
  to: number
): T[] {
  const next = [...items];
  const isOutOfRange =
    from < 0 || from >= next.length || to < 0 || to >= next.length;
  if (from === to || isOutOfRange) {
    return next;
  }
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function MediaTray({
  items,
  onReorder,
  onRemove,
  onSelect,
  selectedId,
  onAdd,
  maxItems,
  addLabel = "Adicionar mídia",
  disabled = false,
  className,
}: MediaTrayProps) {
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const pendingFocusRef = useRef<{ id: string; index: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState({ text: "", count: 0 });

  const canReorder = Boolean(onReorder) && !disabled;
  const limitReached = maxItems !== undefined && items.length >= maxItems;

  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) {
      return;
    }
    pendingFocusRef.current = null;
    if (items[pending.index]?.id !== pending.id) {
      return;
    }
    itemRefs.current
      .get(pending.id)
      ?.querySelector<HTMLElement>(SELECT_BUTTON_SELECTOR)
      ?.focus();
  }, [items]);

  const reorder = (from: number, to: number) => {
    if (!onReorder || from === to) {
      return;
    }
    const moved = items[from];
    pendingFocusRef.current = { id: moved.id, index: to };
    setAnnouncement((prev) => ({
      text: `${moved.fileName} movido para a posição ${to + 1} de ${items.length}`,
      count: prev.count + 1,
    }));
    onReorder(moveItem(items, from, to));
  };

  const getTargetIndex = (from: number, clientX: number) => {
    let target = 0;
    items.forEach((item, index) => {
      if (index === from) {
        return;
      }
      const rect = itemRefs.current.get(item.id)?.getBoundingClientRect();
      if (rect && rect.left + rect.width / 2 < clientX) {
        target += 1;
      }
    });
    return target;
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLLIElement>,
    id: string,
    index: number
  ) => {
    suppressClickRef.current = false;
    const target = event.target as HTMLElement;
    if (
      !canReorder ||
      event.button !== 0 ||
      target.closest(REMOVE_BUTTON_SELECTOR)
    ) {
      return;
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      id,
      from: index,
      to: index,
      startX: event.clientX,
      dragging: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLLIElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    if (
      !drag.dragging &&
      Math.abs(event.clientX - drag.startX) < DRAG_THRESHOLD_PX
    ) {
      return;
    }
    if (!drag.dragging) {
      drag.dragging = true;
      setDraggingId(drag.id);
    }
    drag.to = getTargetIndex(drag.from, event.clientX);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDraggingId(null);
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    if (drag.dragging) {
      suppressClickRef.current = true;
      reorder(drag.from, drag.to);
    }
    endDrag();
  };

  const handleClickCapture = (event: MouseEvent<HTMLLIElement>) => {
    if (!suppressClickRef.current) {
      return;
    }
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    index: number
  ) => {
    const isArrow = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const target = event.target as HTMLElement;
    if (!(canReorder && event.altKey && isArrow)) {
      return;
    }
    if (!target.matches(SELECT_BUTTON_SELECTOR)) {
      return;
    }
    event.preventDefault();
    const to = event.key === "ArrowLeft" ? index - 1 : index + 1;
    if (to < 0 || to >= items.length) {
      return;
    }
    reorder(index, to);
  };

  const registerItem = (id: string) => (node: HTMLLIElement | null) => {
    if (node) {
      itemRefs.current.set(id, node);
    } else {
      itemRefs.current.delete(id);
    }
  };

  const hasSelectButton = Boolean(onSelect) || Boolean(onReorder);

  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto pt-2 pr-2 pb-1",
        className
      )}
      data-slot="media-tray"
    >
      {items.length > 0 && (
        <ul className="flex shrink-0 items-center gap-2">
          {items.map((item, index) => {
            const { id, ...thumbnailProps } = item;
            return (
              <li
                className={cn(
                  "shrink-0",
                  canReorder && "touch-none",
                  draggingId === id && "opacity-50"
                )}
                key={id}
                onClickCapture={handleClickCapture}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPointerCancel={endDrag}
                onPointerDown={(event) => handlePointerDown(event, id, index)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                ref={registerItem(id)}
              >
                <MediaThumbnail
                  {...thumbnailProps}
                  disabled={disabled || item.disabled}
                  index={index}
                  onRemove={onRemove ? () => onRemove(id) : undefined}
                  onSelect={hasSelectButton ? () => onSelect?.(id) : undefined}
                  selected={onSelect ? selectedId === id : undefined}
                />
              </li>
            );
          })}
        </ul>
      )}

      {onAdd && (
        <IconButton
          aria-label={addLabel}
          disabled={disabled || limitReached}
          onClick={onAdd}
          variant="outline"
        >
          <PlusIcon />
        </IconButton>
      )}

      <span aria-live="polite" className="sr-only">
        <span key={announcement.count}>{announcement.text}</span>
      </span>
    </div>
  );
}

export default MediaTray;
