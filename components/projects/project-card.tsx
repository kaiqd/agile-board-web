"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/lib/types";
import { useDeleteProject } from "@/hooks/use-projects";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface ProjectCardProps {
  workspaceId: string;
  project: Project;
}

export function ProjectCard({ workspaceId, project }: ProjectCardProps) {
  const router = useRouter();
  const deleteProject = useDeleteProject(workspaceId);
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success("Projeto excluido.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  return (
    <>
      <Card
        className="hover:bg-accent/30 cursor-pointer gap-4 transition-colors"
        onClick={() => router.push(`/${workspaceId}/${project.id}`)}
      >
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <CardTitle className="line-clamp-1 text-base">{project.name}</CardTitle>
              <Badge variant="secondary">{project.key}</Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Acoes do projeto</span>
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
                      <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa acao remove o projeto e nao pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteProject.isPending}
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
          <p className="text-muted-foreground text-sm">Clique para ver os boards</p>
        </CardContent>
      </Card>

      <CreateProjectDialog
        workspaceId={workspaceId}
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
