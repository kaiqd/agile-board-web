"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Workspace } from "@/lib/types";
import { useDeleteWorkspace } from "@/hooks/use-workspaces";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();
  const deleteWorkspace = useDeleteWorkspace();
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteWorkspace.mutateAsync(workspace.id);
      toast.success("Workspace excluido.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  const createdAt = new Date(workspace.createdAt).toLocaleDateString("pt-BR", {
    dateStyle: "medium",
  });

  return (
    <>
      <Card
        className="hover:bg-accent/30 cursor-pointer gap-4 transition-colors"
        onClick={() => router.push(`/${workspace.id}`)}
      >
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-base">{workspace.name}</CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Acoes do workspace</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="size-4" />
                  Editar
                </DropdownMenuItem>

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
                      <AlertDialogTitle>Excluir workspace?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa acao remove o workspace e nao pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteWorkspace.isPending}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground text-sm">Criado em {createdAt}</p>
        </CardContent>
      </Card>

      <CreateWorkspaceDialog
        workspace={workspace}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
