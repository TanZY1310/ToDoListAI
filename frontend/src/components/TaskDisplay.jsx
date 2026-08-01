import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_BASE_URL } from "../util.js";
import axios from "axios";
import UpdateTaskModal from "./UpdateTaskModal.jsx";
import SubtaskGenerator from "./SubtaskGenerator.jsx";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Pencil, Trash2, CalendarDays, Flag } from "lucide-react";

function TaskDisplay() {
  const [selectedTask, setSelectedTask] = useState(null);
  const queryClient = useQueryClient();

  const getTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      return response.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || e.message);
    }
  };

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-destructive">
        Error: {error.message}
      </div>
    );

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffMs = due - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const renderDueDate = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days === null)
      return <span className="text-muted-foreground">No due date</span>;
    if (days < 0)
      return (
        <span className="text-destructive font-medium">
          {Math.abs(days)}d overdue
        </span>
      );
    if (days === 0)
      return <span className="text-amber-600 font-medium">Today</span>;
    return <span className="text-green-600 font-medium">{days}d left</span>;
  };

  const priorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const handleUpdate = async (updatedTask) => {
    try {
      await axios.put(
        `${API_BASE_URL}/tasks/update/${updatedTask.task_id}`,
        {
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority,
          due_date: updatedTask.dueDate,
        }
      );
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      toast.success("Task updated successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const updateTaskStatus = async (task) => {
    try {
      await axios.put(
        `${API_BASE_URL}/tasks/updateStatus/${task.task_id}`,
        { is_completed: !task.is_completed }
      );
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(
        !task.is_completed ? "Task completed!" : "Task marked in progress"
      );
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/delete/${taskId}`);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground text-lg">No tasks yet</p>
        <p className="text-muted-foreground text-sm mt-1">
          Create your first task above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card
            key={task.task_id}
            className={`transition-all hover:shadow-md ${
              task.is_completed ? "opacity-60" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle
                  className={`text-base leading-snug ${
                    task.is_completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </CardTitle>
                <Badge variant={priorityVariant(task.priority)}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>

              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {renderDueDate(task.due_date)}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={() => updateTaskStatus(task)}
                  id={`task-${task.task_id}`}
                />
                <label
                  htmlFor={`task-${task.task_id}`}
                  className="text-sm cursor-pointer"
                >
                  {task.is_completed ? "Completed" : "In Progress"}
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTask(task)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.task_id)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>

              <SubtaskGenerator task={task} />
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTask && (
        <UpdateTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default TaskDisplay;
