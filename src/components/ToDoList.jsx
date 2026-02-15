import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";

import { Check, Trash2, RotateCcw } from "lucide-react";
import ToDoForm from "./ToDoForm";
import EditTask from "./EditToDo";
import { useState, useEffect } from "react";

const STORAGE_KEY = "vite-todo-app.tasks";

function ToDoList() {
  const [todos, setTodos] = useState(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        // Migration: Ensure all tasks have createdAt and progress
        return parsed.map((task) => ({
          ...task,
          createdAt: task.createdAt || Date.now(),
          progress: task.progress || "",
        }));
      }
      return [
        { id: 0, text: "Test Task 1", completed: false, createdAt: Date.now(), progress: "" },
        { id: 1, text: "Learn React Basics", completed: false, createdAt: Date.now(), progress: "" },
      ];
    } catch (e) {
      console.error("Failed to load tasks from localStorage:", e);
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState("todo");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addNewTask = (newTaskText) => {
    const newItem = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      createdAt: Date.now(),
      progress: "",
    };
    setTodos((prevTodos) => [...prevTodos, newItem]);
  };

  const deleteTask = (taskId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    setTodos((prevTodos) =>
      prevTodos.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const updateProgress = (id, newProgress) => {
    setTodos((prevTodos) =>
      prevTodos.map((task) =>
        task.id === id ? { ...task, progress: newProgress } : task
      )
    );
  };

  const getDaysActive = (timestamp) => {
    const now = Date.now();
    const diffTime = Math.abs(now - timestamp);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const activeTasks = todos.filter((t) => !t.completed);
  const doneTasks = todos.filter((t) => t.completed);

  return (
    <Card className="w-full max-w-md text-center bg-white py-2">
      {/* <CardDescription className="text-lg pt-4">
        Thinking about what to do?
      </CardDescription> */}

      <Tabs defaultValue="todo" className="w-full px-2" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todo">
            To-Do <Badge className="ml-2" variant="neutral">{activeTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="done">
            Done <Badge className="ml-2" variant="neutral">{doneTasks.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <CardContent className="px-4 pt-4">
          <ScrollArea className="h-96 w-full">
            <TabsContent value="todo" className="mt-0">
              {activeTasks.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-2 p-1">
                  {activeTasks.map((todo) => (
                    <AccordionItem key={todo.id} value={`item-${todo.id}`} className="border-2 border-black rounded-base px-2 bg-teal-400">
                      <AccordionTrigger className="font-medium p-1 py-3 break-all mr-2">
                          {todo.text}
                      </AccordionTrigger>
                      
                      <AccordionContent className="text-left px-1 pb-3 bg-teal-400">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-bold w-fit bg-white p-2 rounded-base">
                                Days Active: {getDaysActive(todo.createdAt)}
                            </div>
                            <div className="flex gap-2">
                                <EditTask task={todo} onEditTask={editTask} />
                                <Button
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTaskCompletion(todo.id);
                                    }}
                                    className="shrink-0 bg-white hover:bg-teal-200 border-2 border-black text-black rounded-base"
                                  >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <Textarea 
                                placeholder="Add Progress Notes here..." 
                                value={todo.progress}
                                onChange={(e) => updateProgress(todo.id, e.target.value)}
                                className="bg-white/50 min-h-[60px]"
                            />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="h-40 flex items-center justify-center opacity-50">
                  <span className="font-bold">No tasks to do!</span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="done" className="mt-0">
               {doneTasks.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-2 p-1">
                  {doneTasks.map((todo) => (
                    <AccordionItem key={todo.id} value={`item-${todo.id}`} className="border-2 border-black rounded-base px-2 bg-gray-200 decoration-dotted">
                        <AccordionTrigger className="hover:no-underline text-base font-medium text-left break-all mr-2 p-1 py-3 line-through bg-gray-200">
                            {todo.text}
                        </AccordionTrigger>
                       <AccordionContent className="text-left px-1 pb-3 bg-gray-200">
                            <div className="flex items-center justify-between mb-2 opacity-70">
                                <div className="text-xs font-bold opacity-70">
                                    Days Active: {getDaysActive(todo.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleTaskCompletion(todo.id);
                                        }}
                                        className="h-8 w-8 bg-white hover:bg-teal-200 border-2 border-black text-black rounded-base"
                                        title="Restore"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteTask(todo.id);
                                        }}
                                        className="h-8 w-8 bg-white hover:bg-red-200 border-2 border-black text-black rounded-base"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2 opacity-70">
                                <label className="text-xs font-semibold pr-1">Progress Notes:</label>
                                <Textarea 
                                    value={todo.progress} 
                                    readOnly 
                                    className="bg-white/50 min-h-[60px]" 
                                />
                            </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="h-40 flex items-center justify-center opacity-50">
                  <span className="font-bold">No completed tasks yet!</span>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </CardContent>
      </Tabs>

      <div className="p-4 pt-0">
         {activeTab === 'todo' && <ToDoForm onAddTask={addNewTask} />}
      </div>
    </Card>
  );
}

export default ToDoList;
