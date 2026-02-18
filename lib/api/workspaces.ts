import { get, post, patch, del } from "./client";
import type {
  Workspace,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "@/lib/types";

const BASE = "/workspace";

export function getWorkspaces(): Promise<Workspace[]> {
  return get<Workspace[]>(BASE);
}

export function getWorkspace(id: string): Promise<Workspace> {
  return get<Workspace>(`${BASE}/${id}`);
}

export function createWorkspace(
  data: CreateWorkspaceInput,
): Promise<Workspace> {
  return post<Workspace>(BASE, data);
}

export function updateWorkspace(
  id: string,
  data: UpdateWorkspaceInput,
): Promise<Workspace> {
  return patch<Workspace>(`${BASE}/${id}`, data);
}

export function deleteWorkspace(id: string): Promise<void> {
  return del(`${BASE}/${id}`);
}
