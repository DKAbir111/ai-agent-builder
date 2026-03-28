import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CATEGORY_COLORS } from './DraggableItem';

interface SortableTagProps {
  id: string;
  name: string;
  meta: string;
  category: string;
  onRemove: (id: string) => void;
}

const SortableTag = memo(function SortableTag({ id, name, meta, category, onRemove }: SortableTagProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.formatting;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium group
        ${colorClass}
        ${isDragging ? 'opacity-30' : 'animate-slide-in'}
        select-none
      `}
    >
      <span
        {...listeners}
        {...attributes}
        className="cursor-grab opacity-40 hover:opacity-80 touch-none flex-shrink-0"
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <circle cx="3" cy="2.5" r="1" fill="currentColor"/>
          <circle cx="7" cy="2.5" r="1" fill="currentColor"/>
          <circle cx="3" cy="5" r="1" fill="currentColor"/>
          <circle cx="7" cy="5" r="1" fill="currentColor"/>
          <circle cx="3" cy="7.5" r="1" fill="currentColor"/>
          <circle cx="7" cy="7.5" r="1" fill="currentColor"/>
        </svg>
      </span>
      <span className="truncate flex-1">{name}</span>
      <span className="text-[10px] opacity-50 font-normal hidden sm:block">{meta}</span>
      <button
        onClick={() => onRemove(id)}
        className="ml-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity flex-shrink-0 rounded p-0.5"
        title="Remove"
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 2l8 8M10 2L2 10"/>
        </svg>
      </button>
    </div>
  );
});

interface DropZoneProps {
  droppableId: string;
  items: Array<{ id: string; name: string; meta: string; category: string }>;
  label: string;
  hint: string;
  onRemove: (id: string) => void;
}

const DropZone = memo(function DropZone({ droppableId, items, label, hint, onRemove }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id: droppableId });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">{label}</p>
        {items.length > 0 && (
          <span className="text-[11px] font-medium text-neutral-400">{items.length} added</span>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`
          min-h-[80px] rounded-xl border-2 border-dashed p-2 transition-all duration-150
          ${isOver
            ? 'border-indigo-400 bg-indigo-50/60 drop-zone-active'
            : items.length > 0
              ? 'border-neutral-200 bg-white/60'
              : 'border-neutral-200 bg-white/40'
          }
        `}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-16 gap-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={`transition-colors ${isOver ? 'text-indigo-400' : 'text-neutral-300'}`}>
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
            <span className={`text-[11px] transition-colors ${isOver ? 'text-indigo-500' : 'text-neutral-400'}`}>
              {isOver ? 'Release to add' : hint}
            </span>
          </div>
        ) : (
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {items.map(item => (
                <SortableTag
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  meta={item.meta}
                  category={item.category}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
});

export default DropZone;
