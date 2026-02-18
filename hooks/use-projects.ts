"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api/projects";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/types";

export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.projects(workspaceId),
    queryFn: () => getProjects(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useProject(workspaceId: string, id: string) {
  return useQuery({
    queryKey: queryKeys.project(workspaceId, id),
    queryFn: () => getProject(workspaceId, id),
    enabled: !!workspaceId && !!id,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) =>
      createProject(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects(workspaceId),
      });
    },
  });
}

export function useUpdateProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      updateProject(workspaceId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(workspaceId, id),
      });
    },
  });
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(workspaceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects(workspaceId),
      });
    },
  });
}
