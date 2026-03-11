import {useState} from 'react'
import DatePicker from "./DatePicker.jsx";

function UpdateTaskModal({task, onClose, onUpdate}) {
    const [taskId , setTaskId] = useState(task.task_id || 0);
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.due_date || new Date());
    const [priority, setPriority] = useState(task.priority || "");
    const [isCompleted, setIsCompleted] = useState(task.is_completed || false);
    const [error, setError] = useState("");

    const PRIORITIES = ['Low', 'Medium', 'High'];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) return setError("Please enter a title");
        if (!description.trim()) return setError("Please enter a description");
        if (!priority.trim()) return setError("Please select the priority");

        onUpdate({taskId, title, description, priority, dueDate, isCompleted});
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
                            className="btn btn-ghost btn-sm btn-square"
                            onClick={onClose}
                            aria-label="Close">
                            x
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-error text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="label-text mb-1 block" htmlFor="update-title">Title</label>
                            <input
                                id="update-title"
                                type="text"
                                className="input w-full"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="label-text mb-1 block" htmlFor="update-description">Description</label>
                            <input
                                id="update-description"
                                type="text"
                                className="input w-full"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="dropdown relative inline-flex w-60">
                            <label className="label-text mb-1 block" htmlFor="update-priority">
                              Priority
                            </label>
                          <button
                            id="update-priority-dropdown"
                            type="button"
                            className="dropdown-toggle btn btn-primary w-full justify-between"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Priority Selection"
                          >
                            {priority ? priority : "Select Priority"}
                            <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"></span>
                          </button>

                          {/* The Menu Items */}
                          <ul
                            className="dropdown-menu dropdown-open:opacity-100 hidden w-60 shadow-lg border border-base-content/10"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="update-priority-dropdown"
                          >
                            {PRIORITIES.map((p) => (
                              <li key={p}>
                                <button
                                  type="button"
                                  className={`dropdown-item w-full text-left ${
                                    priority === p ? 'bg-primary/10 text-primary' : ''
                                  }`}
                                  onClick={() => setPriority(p)}
                                >
                                  {p}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <DatePicker
                            id="update-due-date"
                            value={dueDate}
                            onChange={(selectedDate) => setDueDate(selectedDate)}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    id="update-completed"
                                    type="checkbox"
                                    className="checkbox checkbox-success"
                                    checked={isCompleted}
                                    onChange={(e) => setIsCompleted(e.target.checked)}
                                />
                                <label className="label-text" htmlFor="update-completed">Status: </label>
                            </div>
                        </div>

                        <div className="card-actions justify-end mt-2">
                            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateTaskModal;