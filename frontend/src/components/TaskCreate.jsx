import { useRef } from "react";
import axios from "axios";
import TaskInput from "./TaskInput";
import TaskDisplay from "./TaskDisplay";
import { API_BASE_URL } from "../util.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ClipboardList } from "lucide-react";

function TaskCreate() {
  const resetFormRef = useRef(null);
  const queryClient = useQueryClient();

  const createTask = async ({ title, description, priority, dueDate }) => {
    const response = await axios.post(`${API_BASE_URL}/tasks/create`, {
      title,
      description,
      priority,
      due_date: dueDate,
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (resetFormRef.current) resetFormRef.current();
      toast.success("Task created successfully!");
    },
    onError: (e) => {
      toast.error(`Failed to create task: ${e.message}`);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Task Manager</h1>
            <p className="text-sm text-muted-foreground">
              Organize your work, stay on track
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* Create Task Section */}
        <section className="max-w-lg mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Task</CardTitle>
              <CardDescription>
                Fill in the details to add a new task to your list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskInput
                onSubmit={mutation.mutate}
                onResetRef={resetFormRef}
                mode="create"
              />
            </CardContent>
          </Card>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm font-medium text-muted-foreground">
            Your Tasks
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Task Display Section */}
        <section>
          <TaskDisplay />
        </section>
      </div>
    </div>
  );
}

export default TaskCreate;
