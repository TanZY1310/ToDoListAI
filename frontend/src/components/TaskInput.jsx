import { useState, useEffect } from "react";
import DatePicker from "./DatePicker.jsx";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const PRIORITIES = ["Low", "Medium", "High"];

function TaskInput({ onSubmit, onResetRef, mode = "create", initialValues = {} }) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [dueDate, setDueDate] = useState(initialValues.due_date || new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState(initialValues.priority || "");
  const [errors, setErrors] = useState({});

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setDueDate(new Date().toISOString().split("T")[0]);
    setErrors({});
  };

  useEffect(() => {
    if (onResetRef) onResetRef.current = resetFields;
  }, [onResetRef]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Please enter a title";
    if (!description.trim()) newErrors.description = "Please enter a description";
    if (!priority) newErrors.priority = "Please select a priority";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...(mode === "edit" && { task_id: initialValues.task_id }),
      title,
      description,
      priority,
      dueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., Buy Groceries"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g., Buy groceries for the family"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Priority</Label>
        <Select
          value={priority}
          onValueChange={(val) => {
            setPriority(val);
            if (errors.priority) setErrors((prev) => ({ ...prev, priority: undefined }));
          }}
        >
          <SelectTrigger aria-invalid={!!errors.priority}>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-sm text-destructive">{errors.priority}</p>
        )}
      </div>

      <DatePicker
        id="due-date"
        value={dueDate}
        onChange={(selectedDate) => setDueDate(selectedDate)}
      />

      <Button type="submit" className="w-full mt-2">
        {mode === "edit" ? "Save Changes" : "Create Task"}
      </Button>
    </form>
  );
}

export default TaskInput;
