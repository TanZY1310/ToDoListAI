import {useState, useEffect} from "react";
import DatePicker from "./DatePicker.jsx";
import 'flatpickr/dist/flatpickr.min.css';

function TaskInput({onSubmit, onResetRef, mode= "create", initialValues = {} }) {
    const [error, setError] = useState("");

    const [title, setTitle] = useState(initialValues.title || "");
    const [description, setDescription] = useState(initialValues.description || "");
    const [dueDate, setDueDate] = useState(initialValues.due_date || new Date().toISOString().split("T")[0]);
    const [priority, setPriority] = useState( initialValues.priority || "");

    const [resetKey, setResetKey] = useState(0);


    const PRIORITIES = ['Low', 'Medium', 'High'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            e.target.classList.add("validate");
            const firstInvalid = e.target.querySelector(':invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        onSubmit({
            ...(mode === "edit" && { task_id: initialValues.task_id }), // Only include task_id when edit
            title,
            description,
            priority,
            dueDate
        })
    }

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setPriority("");
        setDueDate(new Date().toISOString().split("T")[0]);
        setResetKey(prev => prev + 1);

        // Clear validation state
        const form = document.getElementById("form.needs-validation");
        if (form) form.classList.remove("validate");
    }

    useEffect(() => {
        if (mode === "edit" && window.HSStaticMethods) { //Fix for dropdown not working when in edit mode
            window.HSStaticMethods.autoInit();
        }
        if (onResetRef) onResetRef.current = resetFields;
    }, [mode, onResetRef]);

    return <div>
        <form onSubmit={handleSubmit} className="needs-validation flex flex-col gap-4" noValidate>
            <div className="w-full max-w-sm">
              <label className="label-text mb-1 block" htmlFor="title">
                  Title
              </label>

              <input
                type="text"
                id="title"
                placeholder="e.g., Buy Groceries"
                className="input w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
                <span className="error-message">Please enter a title</span>
            </div>

            <div className="w-full max-w-sm">
              <label className="label-text mb-1 block" htmlFor="description">
                  Description
              </label>

              <input
                type="text"
                id="description"
                placeholder="e.g., Bug Groceries for the family"
                className="input w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
                <span className="error-message">Please enter a description</span>
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
                      onClick={() => {
                          setPriority(p)
                      }}
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/*Hidden input for priority validation*/}
            <input
                type="text"
                value={priority}
                onChange={() => {}}
                required
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
            />
            <span className="error-message">Please select a priority</span>

            <DatePicker
                id="due-date"
                key={resetKey}
                value={dueDate}
                onChange={(selectedDate) => setDueDate(selectedDate)}
            />

            <button
                type="submit"
                className="btn btn-primary"
            >
                {mode === "edit" ? "Save Changes" : "Create Task"}
            </button>
        </form>
    </div>
}

export default TaskInput;