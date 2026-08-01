import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import TaskInput from "./TaskInput.jsx";

function UpdateTaskModal({ task, onClose, onUpdate }) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            Edit the details below and save your changes.
          </DialogDescription>
        </DialogHeader>
        <TaskInput
          mode="edit"
          initialValues={task}
          onSubmit={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateTaskModal;
