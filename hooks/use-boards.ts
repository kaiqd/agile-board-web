"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "@/lib/api/boards";
import type { CreateBoardInput, UpdateBoardInput } from "@/lib/types";

export function useBoards(projectId: string) {
  return useQuery({
    queryKey: queryKeys.boards(projectId),
    queryFn: () => getBoards(projectId),
    enabled: !!projectId,
  });
}

export function useBoard(projectId: string, id: string) {
  return useQuery({
    queryKey: queryKeys.board(projectId, id),
    queryFn: () => getBoard(projectId, id),
    enabled: !!projectId && !!id,
  });
}

export function useCreateBoard(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardInput) => createBoard(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.boards(projectId),
      });
    },
  });
}

export function useUpdateBoard(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardInput }) =>
      updateBoard(projectId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.boards(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.board(projectId, id),
      });
    },
  });
}

export function useDeleteBoard(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBoard(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.boards(projectId),
      });
    },
  });
}
