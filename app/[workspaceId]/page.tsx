"use client";

import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspacePage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;

  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { data: projects, isLoading: projectsLoading } = useProjects(workspaceId);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {workspaceLoading ? "Carregando..." : workspace?.name ?? "Workspace"}
          </h1>
          <p className="text-muted-foreground text-sm">Projetos deste workspace</p>
        </div>

        <CreateProjectDialog workspaceId={workspaceId}>
          <Button>
            <Plus className="size-4" />
            Novo Projeto
          </Button>
        </CreateProjectDialog>
      </div>

      {projectsLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      {!projectsLoading && projects?.length === 0 && (
        <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center">
          Nenhum projeto cadastrado neste workspace.
        </div>
      )}

      {!projectsLoading && (projects?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              workspaceId={workspaceId}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  );
}
