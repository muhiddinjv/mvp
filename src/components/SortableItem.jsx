import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, text, isCorrect, disabled, fontSize }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'default' : 'grab',
    touchAction: disabled ? 'auto' : 'none',
    fontSize
  };

  return (
    <div
      ref={setNodeRef}
      {...(disabled ? {} : { ...attributes, ...listeners })}
      style={style}
      className={`w-full max-w-sm p-3 m-2 rounded shadow text-center text-lg border-2
        ${isCorrect === true ? 'border-green-500' :
          isCorrect === false ? 'border-red-500' :
          'border-gray-300'}
         bg-gray-700 dark:text-white`}
    >
      {text}
    </div>
  );
};

export default SortableItem;
