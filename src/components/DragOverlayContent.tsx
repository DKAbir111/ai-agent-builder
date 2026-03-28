import { memo } from 'react';
import { CATEGORY_COLORS } from './DraggableItem';

interface DragOverlayContentProps {
  name: string;
  meta: string;
  category: string;
}

const DragOverlayContent = memo(function DragOverlayContent({ name, meta, category }: DragOverlayContentProps) {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.formatting;

  return (
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium
      ${colorClass} drag-overlay cursor-grabbing
    `}>
      <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-50">
        <circle cx="3" cy="2.5" r="1" fill="currentColor"/>
        <circle cx="7" cy="2.5" r="1" fill="currentColor"/>
        <circle cx="3" cy="5" r="1" fill="currentColor"/>
        <circle cx="7" cy="5" r="1" fill="currentColor"/>
        <circle cx="3" cy="7.5" r="1" fill="currentColor"/>
        <circle cx="7" cy="7.5" r="1" fill="currentColor"/>
      </svg>
      <span>{name}</span>
      <span className="text-[10px] opacity-60 font-normal">{meta}</span>
    </div>
  );
});

export default DragOverlayContent;
