"use client";

import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useProject } from "@/hooks/use-projects";
import { useBoards } from "@/hooks/use-boards";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { BoardCard } from "@/components/boards/board-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectPage() {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const workspaceId = params.workspaceId;
  const projectId = params.projectId;

  const { data: project, isLoading: projectLoading } = useProject(
    workspaceId,
    projectId,
  );
  const { data: boards, isLoading: boardsLoading } = useBoards(projectId);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {projectLoading ? "Carregando..." : project?.name ?? "Projeto"}
          </h1>
          <p className="text-muted-foreground text-sm">Boards deste projeto</p>
        </div>

        <CreateBoardDialog projectId={projectId}>
          <Button>
            <Plus className="size-4" />
            Novo Board
          </Button>
        </CreateBoardDialog>
      </div>

      {boardsLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {!boardsLoading && boards?.length === 0 && (
        <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center">
          Nenhum board cadastrado neste projeto.
        </div>
      )}

      {!boardsLoading && (boards?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards?.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </section>
  );
}
