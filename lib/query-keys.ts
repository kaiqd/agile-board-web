export const queryKeys = {
  workspaces: ["workspaces"] as const,
  workspace: (id: string) => ["workspaces", id] as const,

  projects: (workspaceId: string) =>
    ["workspaces", workspaceId, "projects"] as const,
  project: (workspaceId: string, id: string) =>
    ["workspaces", workspaceId, "projects", id] as const,

  boards: (projectId: string) => ["projects", projectId, "boards"] as const,
  board: (projectId: string, id: string) =>
    ["projects", projectId, "boards", id] as const,

  columns: (boardId: string) => ["boards", boardId, "columns"] as const,

  tasks: (columnId: string) => ["columns", columnId, "tasks"] as const,
};
