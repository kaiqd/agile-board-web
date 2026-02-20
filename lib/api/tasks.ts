import { del, get, patch, post, put } from "./client";
import type {
  CreateTaskInput,
  MoveTaskInput,
  Task,
  UpdateTaskInput,
} from "@/lib/types";

function basePath(columnId: string) {
  return `/columns/${columnId}/tasks`;
}

export function getTasks(columnId: string): Promise<Task[]> {
  return get<Task[]>(basePath(columnId));
}

export function getTask(columnId: string, id: string): Promise<Task> {
  return get<Task>(`${basePath(columnId)}/${id}`);
}

export function createTask(
  columnId: string,
  data: CreateTaskInput,
): Promise<Task> {
  return post<Task>(basePath(columnId), data);
}

export function updateTask(
  columnId: string,
  id: string,
  data: UpdateTaskInput,
): Promise<Task> {
  return patch<Task>(`${basePath(columnId)}/${id}`, data);
}

export function moveTask(
  columnId: string,
  id: string,
  data: MoveTaskInput,
): Promise<Task> {
  return put<Task>(`${basePath(columnId)}/${id}/move`, data);
}

export function deleteTask(columnId: string, id: string): Promise<void> {
  return del(`${basePath(columnId)}/${id}`);
}
