"use client";

import { type FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/lib/types";
import { useColumns, useCreateColumn, useReorderColumns } from "@/hooks/use-columns";
import {
  useCreateTask,
  useDeleteTask,
  useMoveTask,
  useTasksByColumns,
  useUpdateTask,
} from "@/hooks/use-tasks";
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
import { Skeleton } from "@/components/ui/skeleton";

interface TaskDialogProps {
  columnId: string;
  initialTask?: Task;
  onSave: (payload: { title: string; description: string | null }) => Promise<void>;
  children: React.ReactNode;
}

function TaskDialog({ columnId, initialTask, onSave, children }: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onOpenChange(next: boolean) {
    setOpen(next);

    if (next) {
      setTitle(initialTask?.title ?? "");
      setDescription(initialTask?.description ?? "");
      setError(null);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length < 2) {
      setError("O titulo deve ter pelo menos 2 caracteres.");
      return;
    }

    setPending(true);
    try {
      await onSave({
        title: trimmedTitle,
        description: trimmedDescription.length ? trimmedDescription : null,
      });
      setOpen(false);
    } finally {
      setPending(false);
    }
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
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function BoardPage() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;

  const { data: columns = [], isLoading: isColumnsLoading } = useColumns(boardId);
  const orderedColumns = [...columns].sort((a, b) => a.position - b.position);

  const {
    dataByColumn: tasksMap,
    isLoading: isTasksLoading,
    isFetching: isTasksFetching,
  } = useTasksByColumns(orderedColumns.map((column) => column.id));

  const createColumnMutation = useCreateColumn(boardId);
  const reorderColumnsMutation = useReorderColumns(boardId);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const moveTaskMutation = useMoveTask();

  const [newColumnOpen, setNewColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnError, setNewColumnError] = useState<string | null>(null);

  function resetColumnDialog() {
    setNewColumnName("");
    setNewColumnError(null);
  }

  async function createColumn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = newColumnName.trim();
    if (trimmed.length < 2) {
      setNewColumnError("O nome da coluna deve ter pelo menos 2 caracteres.");
      return;
    }

    try {
      await createColumnMutation.mutateAsync({ name: trimmed });
      toast.success("Coluna criada com sucesso.");
      setNewColumnOpen(false);
      resetColumnDialog();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  async function createTask(columnId: string, payload: { title: string; description: string | null }) {
    try {
      await createTaskMutation.mutateAsync({
        columnId,
        data: {
          title: payload.title,
          description: payload.description ?? undefined,
        },
      });
      toast.success("Tarefa criada com sucesso.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
      throw err;
    }
  }

  async function updateTask(task: Task, payload: { title: string; description: string | null }) {
    try {
      await updateTaskMutation.mutateAsync({
        columnId: task.columnId,
        id: task.id,
        data: {
          title: payload.title,
          description: payload.description ?? undefined,
        },
      });
      toast.success("Tarefa atualizada com sucesso.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
      throw err;
    }
  }

  async function deleteTask(task: Task) {
    try {
      await deleteTaskMutation.mutateAsync({ columnId: task.columnId, id: task.id });
      toast.success("Tarefa excluida.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  async function moveTask(task: Task, direction: -1 | 1) {
    const columnIndex = orderedColumns.findIndex((column) => column.id === task.columnId);
    if (columnIndex < 0) {
      return;
    }

    const targetColumn = orderedColumns[columnIndex + direction];
    if (!targetColumn) {
      return;
    }

    const targetTasks = tasksMap[targetColumn.id] ?? [];

    try {
      await moveTaskMutation.mutateAsync({
        columnId: task.columnId,
        id: task.id,
        data: {
          columnId: targetColumn.id,
          position: targetTasks.length,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  async function moveColumn(columnId: string, direction: -1 | 1) {
    const index = orderedColumns.findIndex((column) => column.id === columnId);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= orderedColumns.length) {
      return;
    }

    const reordered = [...orderedColumns];
    const [column] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, column);

    try {
      await reorderColumnsMutation.mutateAsync({
        orderedIds: reordered.map((item) => item.id),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  const loading = isColumnsLoading || isTasksLoading;

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
                <Button type="submit" disabled={createColumnMutation.isPending}>
                  {createColumnMutation.isPending ? "Criando..." : "Criar coluna"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-96 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && orderedColumns.length === 0 && (
        <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center">
          Nenhuma coluna cadastrada para este board.
        </div>
      )}

      {!loading && orderedColumns.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {orderedColumns.map((column, columnIndex) => {
            const columnTasks = tasksMap[column.id] ?? [];

            return (
              <Card key={column.id} className="gap-4">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{column.name}</CardTitle>
                      <Badge variant="secondary">{columnTasks.length}</Badge>
                    </div>

                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => moveColumn(column.id, -1)}
                        disabled={columnIndex === 0 || reorderColumnsMutation.isPending}
                      >
                        <ChevronLeft className="size-4" />
                        <span className="sr-only">Mover coluna para esquerda</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => moveColumn(column.id, 1)}
                        disabled={
                          columnIndex === orderedColumns.length - 1 ||
                          reorderColumnsMutation.isPending
                        }
                      >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Mover coluna para direita</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <TaskDialog
                    columnId={column.id}
                    onSave={(payload) => createTask(column.id, payload)}
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
                                onSave={(payload) => updateTask(task, payload)}
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
                                      onClick={() => deleteTask(task)}
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
                            onClick={() => moveTask(task, -1)}
                            disabled={columnIndex === 0 || moveTaskMutation.isPending}
                          >
                            <ChevronLeft className="size-4" />
                            <span className="sr-only">Mover para coluna anterior</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => moveTask(task, 1)}
                            disabled={
                              columnIndex === orderedColumns.length - 1 ||
                              moveTaskMutation.isPending
                            }
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
      )}

      {isTasksFetching && !loading && (
        <p className="text-muted-foreground text-xs">Atualizando board...</p>
      )}
    </section>
  );
}
