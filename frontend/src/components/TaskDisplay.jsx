import { useQuery } from '@tanstack/react-query';
import {API_BASE_URL} from "../util.js";
import axios from "axios";

function TaskDisplay(){

    const getTasks = async () => {
        try{
            const response = await axios.get(`${API_BASE_URL}/tasks`);
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

    return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Tasks</h2>

        {/* Responsive Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
                <div
                    key={task.task_id}
                    className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                {task.title}
                            </h3>
                            {/* Urgent Badge */}
                            {task.is_urgent && (
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                    Urgent
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {task.description}
                        </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        {/* Due Date Info */}
                        <div className="text-xs text-gray-500">
                            <span className="font-semibold">Due in:</span> {(() => {
                               const days = getDaysUntilDue(task.due_date);
                               if (days === null) return "No due date";
                               if (days > 0) return <span className="text-red-500">{Math.abs(days)} days overdue</span>;
                                if (days === 0) return <span className="text-orange-500">Due today</span>;
                                return `${days} days`;
                        })()}
                    </div>

                        {/* Status Badge */}
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-md ${
                            task.is_completed 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                            {task.is_completed ? "✓ Completed" : "In Progress"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

}

export default TaskDisplay;