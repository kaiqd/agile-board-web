"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { toast } from "sonner";
import type { Workspace } from "@/lib/types";
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
import {
  useCreateWorkspace,
  useUpdateWorkspace,
} from "@/hooks/use-workspaces";

interface CreateWorkspaceDialogProps {
  workspace?: Workspace;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkspaceDialog({
  workspace,
  children,
  open: controlledOpen,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [name, setName] = useState(workspace?.name ?? "");
  const [error, setError] = useState<string | null>(null);

  const createWorkspace = useCreateWorkspace();
  const updateWorkspace = useUpdateWorkspace();
  const isEditing = Boolean(workspace);
  const pending = createWorkspace.isPending || updateWorkspace.isPending;

  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }

    if (next) {
      setName(workspace?.name ?? "");
      setError(null);
    }

    if (!next && !workspace) {
      setName("");
      setError(null);
    }

    onOpenChange?.(next);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("O nome deve ter pelo menos 2 caracteres.");
      return;
    }

    try {
      if (workspace) {
        await updateWorkspace.mutateAsync({
          id: workspace.id,
          data: { name: trimmed },
        });
        toast.success("Workspace atualizado com sucesso.");
      } else {
        await createWorkspace.mutateAsync({ name: trimmed });
        toast.success("Workspace criado com sucesso.");
      }
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Workspace" : "Novo Workspace"}
          </DialogTitle>
          <DialogDescription>
            Defina um nome para organizar seus projetos.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Nome</Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Ex: Produto"
              minLength={2}
              autoFocus
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

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
