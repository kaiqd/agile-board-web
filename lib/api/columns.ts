import { del, get, patch, post, put } from "./client";
import type {
  Column,
  CreateColumnInput,
  ReorderColumnsInput,
  UpdateColumnInput,
} from "@/lib/types";

function basePath(boardId: string) {
  return `/boards/${boardId}/columns`;
}

export function getColumns(boardId: string): Promise<Column[]> {
  return get<Column[]>(basePath(boardId));
}

export function getColumn(boardId: string, id: string): Promise<Column> {
  return get<Column>(`${basePath(boardId)}/${id}`);
}

export function createColumn(
  boardId: string,
  data: CreateColumnInput,
): Promise<Column> {
  return post<Column>(basePath(boardId), data);
}

export function updateColumn(
  boardId: string,
  id: string,
  data: UpdateColumnInput,
): Promise<Column> {
  return patch<Column>(`${basePath(boardId)}/${id}`, data);
}

export function reorderColumns(
  boardId: string,
  data: ReorderColumnsInput,
): Promise<Column[]> {
  return put<Column[]>(`${basePath(boardId)}/reorder`, data);
}

export function deleteColumn(boardId: string, id: string): Promise<void> {
  return del(`${basePath(boardId)}/${id}`);
}
