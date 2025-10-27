import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Check } from "lucide-react";
import ToDoForm from "./ToDoForm";
import EditTask from "./EditToDo";
import { useState, useEffect } from "react";

const STORAGE_KEY = "vite-todo-app.tasks";

function ToDoList() {
  const [todos, setTodos] = useState(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      return storedTasks
        ? JSON.parse(storedTasks)
        : [
            { id: 0, text: "Test Task 1", completed: false },
            { id: 1, text: "Learn React Basics", completed: false },
          ];
    } catch (e) {
      console.error("Failed to load tasks from localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addNewTask = (newTaskText) => {
    const newItem = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newItem]);
  };

  const deleteTask = (taskId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== taskId));
  };

  const editTask = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  return (
    <Card className="w-full max-w-md text-center m-10 bg-teal-50">
      <CardHeader>
        <CardTitle className="text-2xl">To-Do</CardTitle>
        <CardDescription>
          We got <b className="text-lg">{todos.length}</b> tasks to do
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-100 w-100">
          {todos.length > 0 ? (
            <ul className="flex flex-col">
              {todos.map((todo) => (
                <li key={todo.id}>
                  <Card className="min-h-min m-2 p-2 bg-teal-100  flex-row items-center justify-between">
                    <CardDescription className="text-base">
                      {todo.text}
                    </CardDescription>

                    <div className="flex gap-2">
                      <EditTask task={todo} onEditTask={editTask} />

                      <Button size="icon" onClick={() => deleteTask(todo.id)}>
                        <Check className="h-10 w-10" />
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <CardTitle>Yay! No more tasks!!</CardTitle>
          )}
        </ScrollArea>
      </CardContent>
      <div className="min-w-20">
        <ToDoForm onAddTask={addNewTask} />
      </div>
    </Card>
  );
}

export default ToDoList;
