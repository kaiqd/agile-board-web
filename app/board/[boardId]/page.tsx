"use client";

import { type FormEvent, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { Column, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function buildInitialBoard(boardId: string): { columns: Column[]; tasks: Task[] } {
  const now = new Date().toISOString();

  const todoId = `${boardId}-todo`;
  const inProgressId = `${boardId}-in-progress`;
  const doneId = `${boardId}-done`;

  return {
    columns: [
      {
        id: todoId,
        name: "To Do",
        position: 0,
        boardId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: inProgressId,
        name: "In Progress",
        position: 1,
        boardId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doneId,
        name: "Done",
        position: 2,
        boardId,
        createdAt: now,
        updatedAt: now,
      },
    ],
    tasks: [
      {
        id: `${boardId}-task-1`,
        title: "Definir escopo da sprint",
        description: "Alinhar backlog e prioridades com o time.",
        position: 0,
        boardId,
        columnId: todoId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `${boardId}-task-2`,
        title: "Criar layout inicial do board",
        description: null,
        position: 0,
        boardId,
        columnId: inProgressId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `${boardId}-task-3`,
        title: "Configurar providers globais",
        description: "QueryProvider + Sidebar + Toaster.",
        position: 0,
        boardId,
        columnId: doneId,
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}

interface TaskDialogProps {
  columnId: string;
  initialTask?: Task;
  onSave: (payload: { title: string; description: string | null }) => void;
  children: React.ReactNode;
}

function TaskDialog({ columnId, initialTask, onSave, children }: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  function onOpenChange(next: boolean) {
    setOpen(next);

    if (next) {
      setTitle(initialTask?.title ?? "");
      setDescription(initialTask?.description ?? "");
      setError(null);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length < 2) {
      setError("O titulo deve ter pelo menos 2 caracteres.");
      return;
    }

    onSave({
      title: trimmedTitle,
      description: trimmedDescription.length ? trimmedDescription : null,
    });

    setOpen(false);
  }

  const isEditing = Boolean(initialTask);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da tarefa."
              : "Adicione uma tarefa na coluna selecionada."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input type="hidden" value={columnId} readOnly />

          <div className="space-y-2">
            <Label htmlFor="task-title">Titulo</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              minLength={2}
              placeholder="Ex: Implementar drag and drop"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Descricao</Label>
            <Input
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Opcional"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <DialogFooter>
            <Button type="submit">{isEditing ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function BoardPage() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;
  const nextIdRef = useRef(0);

  const initialData = useMemo(() => buildInitialBoard(boardId), [boardId]);
  const [columns, setColumns] = useState<Column[]>(initialData.columns);
  const [tasks, setTasks] = useState<Task[]>(initialData.tasks);

  const [newColumnOpen, setNewColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnError, setNewColumnError] = useState<string | null>(null);

  const orderedColumns = [...columns].sort((a, b) => a.position - b.position);

  function makeId(prefix: string) {
    nextIdRef.current += 1;
    return `${prefix}-${boardId}-${nextIdRef.current}`;
  }

  function tasksByColumn(columnId: string) {
    return tasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.position - b.position);
  }

  function resetColumnDialog() {
    setNewColumnName("");
    setNewColumnError(null);
  }

  function createColumn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = newColumnName.trim();
    if (trimmed.length < 2) {
      setNewColumnError("O nome da coluna deve ter pelo menos 2 caracteres.");
      return;
    }

    const now = new Date().toISOString();
    const nextColumn: Column = {
      id: makeId("column"),
      name: trimmed,
      position: orderedColumns.length,
      boardId,
      createdAt: now,
      updatedAt: now,
    };

    setColumns((prev) => [...prev, nextColumn]);
    setNewColumnOpen(false);
    resetColumnDialog();
  }

  function addTask(columnId: string, payload: { title: string; description: string | null }) {
    const now = new Date().toISOString();
    const columnTasks = tasksByColumn(columnId);

    const task: Task = {
      id: makeId("task"),
      title: payload.title,
      description: payload.description,
      position: columnTasks.length,
      boardId,
      columnId,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [...prev, task]);
  }

  function updateTask(taskId: string, payload: { title: string; description: string | null }) {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: payload.title,
              description: payload.description,
              updatedAt: now,
            }
          : task,
      ),
    );
  }

  function deleteTask(taskId: string) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  function moveTask(taskId: string, direction: -1 | 1) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    const columnIndex = orderedColumns.findIndex((column) => column.id === task.columnId);
    if (columnIndex < 0) {
      return;
    }

    const targetColumn = orderedColumns[columnIndex + direction];
    if (!targetColumn) {
      return;
    }

    const now = new Date().toISOString();
    const targetColumnTasks = tasksByColumn(targetColumn.id);

    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? {
              ...item,
              columnId: targetColumn.id,
              position: targetColumnTasks.length,
              updatedAt: now,
            }
          : item,
      ),
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kanban Board</h1>
          <p className="text-muted-foreground text-sm">Board ID: {boardId}</p>
        </div>

        <Dialog
          open={newColumnOpen}
          onOpenChange={(next) => {
            setNewColumnOpen(next);
            if (next) {
              resetColumnDialog();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Nova Coluna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova coluna</DialogTitle>
              <DialogDescription>
                Crie uma coluna para organizar tarefas no board.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={createColumn}>
              <div className="space-y-2">
                <Label htmlFor="column-name">Nome</Label>
                <Input
                  id="column-name"
                  value={newColumnName}
                  onChange={(event) => {
                    setNewColumnName(event.target.value);
                    if (newColumnError) {
                      setNewColumnError(null);
                    }
                  }}
                  placeholder="Ex: Em QA"
                  minLength={2}
                  autoFocus
                />
                {newColumnError && (
                  <p className="text-destructive text-sm">{newColumnError}</p>
                )}
              </div>

              <DialogFooter>
                <Button type="submit">Criar coluna</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {orderedColumns.map((column, columnIndex) => {
          const columnTasks = tasksByColumn(column.id);

          return (
            <Card key={column.id} className="gap-4">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{column.name}</CardTitle>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <TaskDialog
                  columnId={column.id}
                  onSave={(payload) => addTask(column.id, payload)}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="size-4" />
                    Nova Tarefa
                  </Button>
                </TaskDialog>

                <div className="space-y-2">
                  {columnTasks.length === 0 && (
                    <div className="text-muted-foreground rounded-md border border-dashed p-3 text-sm">
                      Nenhuma tarefa nesta coluna.
                    </div>
                  )}

                  {columnTasks.map((task) => (
                    <div key={task.id} className="rounded-md border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="size-7">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Acoes da tarefa</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <TaskDialog
                              columnId={task.columnId}
                              initialTask={task}
                              onSave={(payload) => updateTask(task.id, payload)}
                            >
                              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                                <Pencil className="size-4" />
                                Editar
                              </DropdownMenuItem>
                            </TaskDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={(event) => event.preventDefault()}
                                >
                                  <Trash2 className="size-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Essa acao remove a tarefa permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    variant="destructive"
                                    onClick={() => deleteTask(task.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => moveTask(task.id, -1)}
                          disabled={columnIndex === 0}
                        >
                          <ChevronLeft className="size-4" />
                          <span className="sr-only">Mover para coluna anterior</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => moveTask(task.id, 1)}
                          disabled={columnIndex === orderedColumns.length - 1}
                        >
                          <ChevronRight className="size-4" />
                          <span className="sr-only">Mover para proxima coluna</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
