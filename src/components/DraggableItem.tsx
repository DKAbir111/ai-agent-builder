import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export type DragItemType = 'skill' | 'layer';

interface DraggableItemProps {
  id: string;
  name: string;
  meta: string;
  type: DragItemType;
  category?: string;
  disabled?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  information: 'bg-sky-50 text-sky-700 border-sky-200',
  action:      'bg-amber-50 text-amber-700 border-amber-200',
  reasoning:   'bg-violet-50 text-violet-700 border-violet-200',
  personality: 'bg-rose-50 text-rose-700 border-rose-200',
  context:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  formatting:  'bg-neutral-100 text-neutral-700 border-neutral-200',
};

const DraggableItem = memo(function DraggableItem({
  id, name, meta, type, category, disabled
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, name, meta, category },
    disabled,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : undefined,
  } : undefined;

  const colorClass = category
    ? (CATEGORY_COLORS[category] || CATEGORY_COLORS.formatting)
    : (type === 'skill' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-violet-50 text-violet-700 border-violet-200');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium
        select-none transition-all duration-100
        ${colorClass}
        ${isDragging ? 'opacity-30' : 'cursor-grab hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
      title={disabled ? 'Already added' : `Drag to add ${name}`}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        className="opacity-50 flex-shrink-0"
      >
        <circle cx="3" cy="2.5" r="1" fill="currentColor"/>
        <circle cx="7" cy="2.5" r="1" fill="currentColor"/>
        <circle cx="3" cy="5" r="1" fill="currentColor"/>
        <circle cx="7" cy="5" r="1" fill="currentColor"/>
        <circle cx="3" cy="7.5" r="1" fill="currentColor"/>
        <circle cx="7" cy="7.5" r="1" fill="currentColor"/>
      </svg>
      <span className="truncate">{name}</span>
      <span className="text-[10px] opacity-60 ml-auto flex-shrink-0 font-normal">{meta}</span>
    </div>
  );
});

export { CATEGORY_COLORS };
export default DraggableItem;
