import { useQuery } from '@tanstack/react-query';
import {useEffect, useRef, useState} from 'react';
import {API_BASE_URL} from "../util.js";
import axios from "axios";
import UpdateTaskModal from "./UpdateTaskModal.jsx";
import { useQueryClient } from "@tanstack/react-query";
import SubtaskGenerator from "./SubtaskGenerator.jsx";
import {Notyf} from "notyf";

function TaskDisplay(){

    const [selectedTask, setSelectedTask] = useState(null);
    const queryClient = useQueryClient();
    const notyfRef = useRef(null);

    useEffect(() => {
        notyfRef.current = new Notyf({
            duration: 3000,
            position: "top-right",
        });

    }, [])

    const getTasks = async () => {
        try{
            const response = await axios.get(`${API_BASE_URL}/tasks`);
            console.log("Data from getTasks", response.data);
            return response.data;
        } catch (e) {
            throw new Error(e.response?.data?.message || e.message);
        }
    }

    const {data: tasks = [], isLoading, error} = useQuery({
        queryKey: ['tasks'],
        queryFn: getTasks
    });

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    // Calculate remaining days left until due date
    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0); //Strip time for accurate day comparison

        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        const diffMs = due - today;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    const renderDueDate = (dueDate) => {
        const days = getDaysUntilDue(dueDate);
        if (days === null) return <span>No Due Date</span>;
        if (days < 0 ) return <span className="text-red-500">{Math.abs(days)} days overdue</span>;
        if (days === 0) return <span className="text-orange-500">Today</span>;
        return <span className="text-green-600">{days} days</span>;

    }

    // Update save changes
    const handleUpdate = async (updatedTask) => {
        console.log("Data from updatedTask", updatedTask);

        try {
            await axios.put(`${API_BASE_URL}/tasks/update/${updatedTask.task_id}`,
                {title: updatedTask.title, description: updatedTask.description, priority: updatedTask.priority, due_date: updatedTask.dueDate});
            await queryClient.invalidateQueries({queryKey: ['tasks']})
            setSelectedTask(null);
            notyfRef.current?.success('Task updated successfully!');
        } catch (e) {
            notyfRef.current?.error(e.response?.data?.message || e.message)
        }
    }

    const updateTaskStatus = async (task) => {
        console.log("Data from updateTaskStatus", task);
        try {
            await axios.put(`${API_BASE_URL}/tasks/updateStatus/${task.task_id}`, {
                is_completed: !task.is_completed
            });
            await queryClient.invalidateQueries({queryKey: ['tasks']})
            notyfRef.current?.success(!task.is_completed? 'Task status: Complete' : 'Task Status: In Progress');
        } catch (e) {
            notyfRef.current?.error(e.response?.data?.message || e.message)
        }
    }

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`${API_BASE_URL}/tasks/delete/${taskId}`);
            await queryClient.invalidateQueries({queryKey: ['tasks']})
            notyfRef.current?.success('Task deleted successfully!');
        } catch (e) {
            notyfRef.current?.error(e.response?.data?.message || e.message)
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            {/* Responsive Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <div key={task.task_id} className="card sm:max-w-sm">
                        <div className="card-body">

                            {/* Title Row with Urgent Badge */}
                            <div className="flex justify-between items-start mb-1">
                                <h5 className="card-title">{task.title}</h5>
                            </div>

                            {/* Description */}
                            <div className="card-actions justify-between items-center">
                                <div className="text-xs text-base-content/60">
                                    <span className="font-semibold">Description: </span>
                                    {task.description}
                                </div>
                            </div>

                            {/* Due Date & Status Row */}
                            <div className="card-actions justify-between items-center">
                                <div className="text-xs text-base-content/60">
                                    <span className="font-semibold">Due in: </span>
                                    {renderDueDate(task.due_date)}
                                </div>
                            </div>

                            <div className="card-actions justify-between items-center">
                                <div className="text-xs text-base-content/60">
                                    <span className="font-semibold">Priority: </span>
                                    {task.priority}
                                </div>
                            </div>


                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-success"
                                    checked={task.is_completed}
                                    onChange={() => updateTaskStatus(task)}
                                />
                                <span className={`badge badge-soft text-xs font-medium ${
                                    task.is_completed ? "badge-success" : "badge-warning"
                                }`}>
                                    Status: {task.is_completed ? "✓ Completed" : "In Progress"}
                                </span>
                            </div>

                            <div className="card-actions mt-3">
                                <button className="btn btn-square  [--btn-color:#1877F2] text-white" aria-label="Edit Icon Button"
                                        onClick={() => {
                                            console.log("Data taken to update task", task)
                                            setSelectedTask(task)

                                        }}>
                                    <span className="icon-[tabler--edit] size-5 shrink-0"></span>
                                </button>

                                <button className="btn btn-square  [--btn-color:#1877F2] text-white" aria-label="Delete Icon Button"
                                        onClick={() => deleteTask(task.task_id)}>
                                    <span className="icon-[tabler--trash] size-5 shrink-0"></span>
                                </button>
                            </div>

                            <SubtaskGenerator task={task} />

                        </div>
                    </div>
                ))}
            </div>

            {selectedTask && (
                <UpdateTaskModal
                    task={selectedTask}
                    onClose={() => {
                        setSelectedTask(null)
                    }}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}

export default TaskDisplay;