"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { toast } from "sonner";
import type { Project } from "@/lib/types";
import { ApiRequestError } from "@/lib/api/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";

interface CreateProjectDialogProps {
  workspaceId: string;
  project?: Project;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProjectDialog({
  workspaceId,
  project,
  children,
  open: controlledOpen,
  onOpenChange,
}: CreateProjectDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [name, setName] = useState(project?.name ?? "");
  const [key, setKey] = useState(project?.key ?? "");
  const [error, setError] = useState<string | null>(null);

  const createProject = useCreateProject(workspaceId);
  const updateProject = useUpdateProject(workspaceId);
  const isEditing = Boolean(project);
  const pending = createProject.isPending || updateProject.isPending;

  const open = controlledOpen ?? uncontrolledOpen;

  function normalizeKey(value: string) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
  }

  function setOpen(next: boolean) {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }

    if (next) {
      setName(project?.name ?? "");
      setKey(project?.key ?? "");
      setError(null);
    }

    if (!next && !project) {
      setName("");
      setKey("");
      setError(null);
    }

    onOpenChange?.(next);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const normalizedKey = normalizeKey(key);

    if (trimmedName.length < 2) {
      setError("O nome deve ter pelo menos 2 caracteres.");
      return;
    }

    if (normalizedKey.length < 2 || normalizedKey.length > 5) {
      setError("A key deve ter entre 2 e 5 caracteres.");
      return;
    }

    try {
      if (project) {
        await updateProject.mutateAsync({
          id: project.id,
          data: { name: trimmedName, key: normalizedKey },
        });
        toast.success("Projeto atualizado com sucesso.");
      } else {
        await createProject.mutateAsync({ name: trimmedName, key: normalizedKey });
        toast.success("Projeto criado com sucesso.");
      }

      setOpen(false);
    } catch (err) {
      if (err instanceof ApiRequestError && err.statusCode === 409) {
        toast.error("A key informada ja esta em uso neste workspace.");
        return;
      }

      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
          <DialogDescription>
            Defina nome e key para identificar o projeto.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="project-name">Nome</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Ex: Plataforma Web"
              minLength={2}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-key">Key</Label>
            <Input
              id="project-key"
              value={key}
              onChange={(event) => {
                setKey(normalizeKey(event.target.value));
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Ex: WEB"
              maxLength={5}
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
