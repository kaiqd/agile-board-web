export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  position: number;
  boardId: string;
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateWorkspaceInput = Pick<Workspace, "name">;
export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput>;

export type CreateProjectInput = Pick<Project, "name" | "key">;
export type UpdateProjectInput = Partial<CreateProjectInput>;

export type CreateBoardInput = Pick<Board, "name">;
export type UpdateBoardInput = Partial<CreateBoardInput>;

export type CreateTaskInput = Pick<Task, "title"> & { description?: string };
export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface MoveTaskInput {
  columnId: string;
  position: number;
}

export interface ReorderColumnsInput {
  orderedIds: string[];
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
