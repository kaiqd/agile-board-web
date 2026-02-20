"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  moveTask,
  updateTask,
} from "@/lib/api/tasks";
import { queryKeys } from "@/lib/query-keys";
import type {
  CreateTaskInput,
  MoveTaskInput,
  Task,
  UpdateTaskInput,
} from "@/lib/types";

export function useTasks(columnId: string) {
  return useQuery({
    queryKey: queryKeys.tasks(columnId),
    queryFn: () => getTasks(columnId),
    enabled: !!columnId,
  });
}

export function useTask(columnId: string, id: string) {
  return useQuery({
    queryKey: [...queryKeys.tasks(columnId), id],
    queryFn: () => getTask(columnId, id),
    enabled: !!columnId && !!id,
  });
}

export function useTasksByColumns(columnIds: string[]) {
  const queries = useQueries({
    queries: columnIds.map((columnId) => ({
      queryKey: queryKeys.tasks(columnId),
      queryFn: () => getTasks(columnId),
      enabled: !!columnId,
    })),
  });

  const dataByColumn = useMemo(() => {
    return columnIds.reduce<Record<string, Task[]>>((acc, columnId, index) => {
      acc[columnId] = queries[index]?.data ?? [];
      return acc;
    }, {});
  }, [columnIds, queries]);

  const isLoading = queries.some((query) => query.isLoading);
  const isFetching = queries.some((query) => query.isFetching);

  return { dataByColumn, isLoading, isFetching };
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      data,
    }: {
      columnId: string;
      data: CreateTaskInput;
    }) => createTask(columnId, data),
    onSuccess: (_, { columnId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(columnId) });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      id,
      data,
    }: {
      columnId: string;
      id: string;
      data: UpdateTaskInput;
    }) => updateTask(columnId, id, data),
    onSuccess: (_, { columnId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(columnId) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ columnId, id }: { columnId: string; id: string }) =>
      deleteTask(columnId, id),
    onSuccess: (_, { columnId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(columnId) });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      id,
      data,
    }: {
      columnId: string;
      id: string;
      data: MoveTaskInput;
    }) => moveTask(columnId, id, data),
    onSuccess: (_, { columnId, data }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(columnId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(data.columnId) });
    },
  });
}
