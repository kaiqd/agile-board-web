import { get, post, patch, del } from "./client";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/lib/types";

function basePath(workspaceId: string) {
  return `/workspaces/${workspaceId}/projects`;
}

export function getProjects(workspaceId: string): Promise<Project[]> {
  return get<Project[]>(basePath(workspaceId));
}

export function getProject(
  workspaceId: string,
  id: string,
): Promise<Project> {
  return get<Project>(`${basePath(workspaceId)}/${id}`);
}

export function createProject(
  workspaceId: string,
  data: CreateProjectInput,
): Promise<Project> {
  return post<Project>(basePath(workspaceId), data);
}

export function updateProject(
  workspaceId: string,
  id: string,
  data: UpdateProjectInput,
): Promise<Project> {
  return patch<Project>(`${basePath(workspaceId)}/${id}`, data);
}

export function deleteProject(
  workspaceId: string,
  id: string,
): Promise<void> {
  return del(`${basePath(workspaceId)}/${id}`);
}
