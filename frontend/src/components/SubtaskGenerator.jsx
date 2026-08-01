import { useState } from "react";
import { API_BASE_URL } from "../util.js";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
      const response = await fetch(
        `${API_BASE_URL}/tasks/ollama/subtasks?title=${encodeURIComponent(task.title)}&description=${encodeURIComponent(task.description)}`
      );
      const data = await response.json();
      const parsed = JSON.parse(data);
      setSubtasks(parsed);
      toast.success("Subtasks generated successfully!");
    } catch {
      const errorMsg = `Failed to generate subtasks. Make sure Ollama is running.`;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={generateSubtasks}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isLoading ? "Generating..." : "Generate Subtasks"}
      </Button>

      {error && (
        <p className="text-xs text-destructive mt-2">{error}</p>
      )}

      {isOpen && subtasks.length > 0 && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Suggested Subtasks
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <ul className="flex flex-col gap-1.5">
            {subtasks.map((subtask, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>{subtask}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SubtaskGenerator;
