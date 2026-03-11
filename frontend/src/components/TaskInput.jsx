import {useState, useEffect} from "react";
import DatePicker from "./DatePicker.jsx";
import 'flatpickr/dist/flatpickr.min.css';

function TaskInput({onSubmit, onResetRef}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const [error, setError] = useState("");
    const [priority, setPriority] = useState("");

    const [resetKey, setResetKey] = useState(0);

    const PRIORITIES = ['Low', 'Medium', 'High'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) return setError("Please enter a title");
        if (!description.trim()) return setError("Please enter a description");
        if (!priority.trim()) return setError("Please set the priority");

        onSubmit({title, description, priority, dueDate});
    }

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setPriority("");
        setDueDate(new Date());
        setResetKey(prev => prev + 1);
    }

    useEffect(() => {
        if (onResetRef) onResetRef.current = resetFields;
    }, [])

    return <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="w-full max-w-sm">
              <label className="label-text mb-1 block" htmlFor="title">
                  Title
              </label>

              <input
                type="text"
                id="title"
                placeholder="e.g., Buy Groceries"
                className={`input w-full ${error ? 'input-error' : ''}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/*<span className={`helper-text mt-1 ${error ? 'text-error' : 'text-slate-500'}`}>*/}
              {/*  {error ? error : "Give your task a clear, concise name"}*/}
              {/*</span>*/}
            </div>

            <div className="w-full max-w-sm">
              <label className="label-text mb-1 block" htmlFor="description">
                  Description
              </label>

              <input
                type="text"
                id="description"
                placeholder="e.g., Bug Groceries for the family"
                className={`input w-full ${error ? 'input-error' : ''}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/*<span className={`helper-text mt-1 ${error ? 'text-error' : 'text-slate-500'}`}>*/}
              {/*  {error ? error : "Give your description a clear, concise name"}*/}
              {/*</span>*/}
            </div>

            <div className="dropdown relative inline-flex w-60">
                <label className="label-text mb-1 block" htmlFor="priority">
                  Priority
                </label>
              <button
                id="priority-dropdown"
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
                aria-labelledby="priority-dropdown"
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
                id="due-date"
                key={resetKey}
                value={dueDate}
                onChange={(selectedDate) => setDueDate(selectedDate)}
            />

            <button
                type="submit"
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm"
            >
                Create Task
            </button>
        </form>
    </div>
}

export default TaskInput;