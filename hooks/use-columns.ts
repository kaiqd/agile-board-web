"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumn,
  deleteColumn,
  getColumn,
  getColumns,
  reorderColumns,
  updateColumn,
} from "@/lib/api/columns";
import { queryKeys } from "@/lib/query-keys";
import type {
  CreateColumnInput,
  ReorderColumnsInput,
  UpdateColumnInput,
} from "@/lib/types";

export function useColumns(boardId: string) {
  return useQuery({
    queryKey: queryKeys.columns(boardId),
    queryFn: () => getColumns(boardId),
    enabled: !!boardId,
  });
}

export function useColumn(boardId: string, id: string) {
  return useQuery({
    queryKey: [...queryKeys.columns(boardId), id],
    queryFn: () => getColumn(boardId, id),
    enabled: !!boardId && !!id,
  });
}

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnInput) => createColumn(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns(boardId) });
    },
  });
}

export function useUpdateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColumnInput }) =>
      updateColumn(boardId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns(boardId) });
    },
  });
}

export function useReorderColumns(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderColumnsInput) => reorderColumns(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns(boardId) });
    },
  });
}

export function useDeleteColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteColumn(boardId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns(boardId) });
    },
  });
}
