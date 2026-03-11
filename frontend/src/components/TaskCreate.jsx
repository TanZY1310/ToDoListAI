import {useRef, useState} from 'react';
import axios from 'axios';
import TaskInput from './TaskInput';
import TaskDisplay from './TaskDisplay';
import {API_BASE_URL} from "../util.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";

function TaskCreate() {
    const [task, setTask] = useState(null)
    const [error, setError] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("")
    const [dueDate, setDueDate] = useState(new Date())

    const resetFormRef = useRef(null);

    const queryClient = useQueryClient();

    const createTask = async ({title, description, priority, dueDate}) => {
        setError(null)
        setTitle(title)
        setDescription(description)
        setPriority(priority)
        setDueDate(dueDate)

        try {
            const response = await axios.post(`${API_BASE_URL}/tasks/create`,
                {title: title, description: description, priority: priority, due_date: dueDate});
            console.log(response.data);
            setTask(response.data);
        } catch (e) {
            setError(`Failed to create task: ${e.message}`)
        }
    }

    const mutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]); // Marks the cache as stale and auto fetch backend without page refresh
            if (resetFormRef.current) resetFormRef.current(); //Reset field value after create task
        },
    });

    return (
        <div className="min-h-screen bg-base-200">

            {/* Page Header */}
            <div className="bg-base-100 border-b border-base-content/10 px-6 py-4">
                <h1 className="text-2xl font-bold text-base-content">Task Manager</h1>
                <p className="text-sm text-base-content/60 mt-0.5">Create and manage your tasks</p>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">

                {/* Task Creation Section */}
                <section>
                    <div className="card max-w-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-2">Create New Task</h2>

                            {/* Error Alert */}
                            {error && (
                                <div className="alert alert-error text-sm mb-2">
                                    {error}
                                </div>
                            )}

                            {/* Success Alert */}
                            {mutation.isSuccess && (
                                <div className="alert alert-success text-sm mb-2">
                                    Task created successfully!
                                </div>
                            )}

                            <TaskInput onSubmit={mutation.mutate} onResetRef={resetFormRef} />
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="divider text-primary text-sm">Your Tasks</div>

                {/* Task Display Section */}
                <section>
                    <TaskDisplay />
                </section>

            </div>
        </div>
    );
}

export default TaskCreate;