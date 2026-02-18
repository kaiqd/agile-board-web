"use client";

import { Plus } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: workspaces, isLoading } = useWorkspaces();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Workspaces</h1>
          <p className="text-muted-foreground text-sm">
            Escolha um workspace para navegar pelos projetos.
          </p>
        </div>

        <CreateWorkspaceDialog>
          <Button>
            <Plus className="size-4" />
            Novo Workspace
          </Button>
        </CreateWorkspaceDialog>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && workspaces?.length === 0 && (
        <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center">
          Nenhum workspace cadastrado.
        </div>
      )}

      {!isLoading && (workspaces?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces?.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </section>
  );
}
