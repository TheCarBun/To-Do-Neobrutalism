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
    <Card className="w-full max-w-md text-center bg-white">
      {/* <CardHeader> */}
        {/* <CardTitle className="text-2xl">To-Do</CardTitle> */}
        <CardDescription className="text-lg">
          We got <b className="text-xl">{todos.length}</b> tasks to do
        </CardDescription>
      {/* </CardHeader> */}
      <CardContent className="px-4">
        <ScrollArea className="h-96 w-full">
          {todos.length > 0 ? (
            <ul className="flex flex-col">
              {todos.map((todo) => (
                <li key={todo.id} className="p-1">
                  <Card className="flex flex-row items-center justify-between p-3 bg-teal-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <span className="text-base font-medium text-left break-all mr-2 p-1">
                      {todo.text}
                    </span>

                    <div className="flex gap-2 shrink-0">
                      <EditTask task={todo} onEditTask={editTask} />

                      <Button 
                        size="icon" 
                        onClick={() => deleteTask(todo.id)}
                        className="bg-white hover:bg-red-100 border-2 border-black text-black"
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
             <div className="h-full flex items-center justify-center p-10 opacity-50">
                <CardTitle>Yay! No more tasks!!</CardTitle>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <div className="p-4 pt-0">
        <ToDoForm onAddTask={addNewTask} />
      </div>
    </Card>
  );
}

export default ToDoList;
