import { useState } from 'react'
import TaskInput from "./TaskInput.jsx";

function UpdateTaskModal({task, onClose, onUpdate}) {
    const [taskId , setTaskId] = useState(task.task_id || 0);
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.due_date || new Date());
    const [priority, setPriority] = useState(task.priority || "");

    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) return setError("Please enter a title");
        if (!description.trim()) return setError("Please enter a description");
        if (!priority.trim()) return setError("Please select the priority");

        onUpdate({taskId, title, description, priority, dueDate});
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
             onClick={onClose}>
            <div className="card w-full max-w-md mx-4 shadow-xl"
                 onClick={(e)=> e.stopPropagation()}>

                <div className="card-body gap-4">
                    <div className="flex justify-between items-center">
                        <h5 className="card-title">Update Task</h5>
                        <button
                            type="button"
                            className="btn btn-square  [--btn-color:#1877F2] text-white" aria-label="Close Icon Button"
                            onClick={onClose}
                            >
                            <span className="icon-[tabler--x] size-5 shrink-0"></span>
                        </button>
                    </div>

                    <TaskInput mode="edit"
                               initialValues={task}
                               onSubmit={onUpdate}
                    />
                </div>
            </div>
        </div>
    )
}

export default UpdateTaskModal;