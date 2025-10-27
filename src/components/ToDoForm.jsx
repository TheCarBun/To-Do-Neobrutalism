import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

function ToDoForm({ onAddTask }) {
  const [newTask, setNewTask] = useState("");

  const addToDo = (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    onAddTask(newTask);
    setNewTask("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>We got more stuff to do??</DialogDescription>
        </DialogHeader>

        <form onSubmit={addToDo} className="flex flex-col gap-6">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                className="w-[auto] grid gap-2"
                type="text"
                placeholder="Add New Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="neutral">Cancel</Button>
            </DialogClose>

            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ToDoForm;
