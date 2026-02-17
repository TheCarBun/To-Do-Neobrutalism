import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// This component takes the specific task and the update function as props
function EditTask({ task, onEditTask }) {
  // Use local state to manage the text being edited. Initialize it with the current task text.
  const [editText, setEditText] = useState(task.text);

  // State to control if the dialog is open or closed
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();
    if (editText.trim() === "") return;

    // 1. Call the parent function, passing the task's ID and the new text
    onEditTask(task.id, editText);

    // 2. Close the dialog after successful save
    setIsOpen(false);
  };

  // 3. Reset the local state when the dialog is opened again (in case of cancel)
  const handleOpenChange = (open) => {
    setIsOpen(open);
    // If closing, reset the local input to the original task text
    if (!open) {
      setEditText(task.text);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" className="bg-secondary-background text-foreground hover:bg-yellow-500">
          <Pencil className="h-10 m-10" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEdit} className="flex flex-col gap-6">
          <div className="grid gap-4">
            <Input
              className="w-full"
              type="text"
              placeholder="Task Text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          </div>

          <DialogFooter>
            {/* The cancel button simply uses the built-in DialogClose */}
            <DialogClose asChild>
              <Button variant="neutral" type="button">
                Cancel
              </Button>
            </DialogClose>

            {/* The Save button triggers the onSubmit function */}
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTask;
