import { get, post, patch, del } from "./client";
import type { Board, CreateBoardInput, UpdateBoardInput } from "@/lib/types";

function basePath(projectId: string) {
  return `/projects/${projectId}/boards`;
}

export function getBoards(projectId: string): Promise<Board[]> {
  return get<Board[]>(basePath(projectId));
}

export function getBoard(projectId: string, id: string): Promise<Board> {
  return get<Board>(`${basePath(projectId)}/${id}`);
}

export function createBoard(
  projectId: string,
  data: CreateBoardInput,
): Promise<Board> {
  return post<Board>(basePath(projectId), data);
}

export function updateBoard(
  projectId: string,
  id: string,
  data: UpdateBoardInput,
): Promise<Board> {
  return patch<Board>(`${basePath(projectId)}/${id}`, data);
}

export function deleteBoard(projectId: string, id: string): Promise<void> {
  return del(`${basePath(projectId)}/${id}`);
}
