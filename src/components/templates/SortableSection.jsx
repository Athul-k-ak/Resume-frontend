import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableSection = ({ id, title, onRemove, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="form-section card">
      <div className="section-header">
        <span className="drag-handle" {...attributes} {...listeners}>
          ☰
        </span>
        <h3 className="section-title">{title}</h3>
        <button onClick={onRemove} className="btn-text-danger">
          Remove
        </button>
      </div>
      {children}
    </div>
  );
};

export default SortableSection;
