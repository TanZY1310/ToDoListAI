import { useState } from 'react';
import {API_BASE_URL} from "../util.js";

function SubtaskGenerator({ task }) {
    const [subtasks, setSubtasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const generateSubtasks = async () => {
        setIsLoading(true);
        setError(null);
        setIsOpen(true);

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/ollama/subtasks?title=${encodeURIComponent(task.title)}&description=${encodeURIComponent(task.description)}`);
            const data = await response.json();
            const parsed = JSON.parse(data);
            setSubtasks(parsed);
        } catch (e) {
            setError('Failed to generate subtasks. Make sure Ollama is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-2">
            <button
                type="button"
                className="btn btn-outline"
                onClick={generateSubtasks}
                disabled={isLoading}
            >
                {isLoading
                    ? <span className="loading loading-spinner loading-xs"></span>
                    : <span className="icon-[tabler--list-details] size-5 shrink-0"></span>
                }
                {isLoading ? 'Generating...' : 'Generate Subtasks'}
            </button>

            {error && (
                <div className="alert alert-error text-xs mt-2">{error}</div>
            )}

            {isOpen && subtasks.length > 0 && (
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                            Suggested Subtasks
                        </p>
                        <button
                            type="button"
                            className="btn btn-square  [--btn-color:#1877F2] text-white" aria-label="Close Icon Button"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="icon-[tabler--x] size-5 shrink-0"></span>
                        </button>
                    </div>
                    <ul className="flex flex-col gap-2">
                        {subtasks.map((subtask, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-base-content/80"
                            >
                                <span className="icon-[tabler--circle-check] size-4 shrink-0 text-primary mt-0.5"></span>
                                {subtask}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SubtaskGenerator;