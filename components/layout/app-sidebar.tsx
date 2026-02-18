"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: workspaces, isLoading } = useWorkspaces();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-md">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Agile Board</p>
            <p className="text-muted-foreground text-xs">Workspace Manager</p>
          </div>
        </div>
        <CreateWorkspaceDialog>
          <Button size="sm" className="w-full" type="button">
            <Plus className="size-4" />
            Criar Workspace
          </Button>
        </CreateWorkspaceDialog>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <SidebarMenuSkeleton key={index} />
                ))}

              {workspaces?.map((workspace) => {
                const active = pathname === `/${workspace.id}`;

                return (
                  <SidebarMenuItem key={workspace.id}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={`/${workspace.id}`}>
                        <span>{workspace.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {!isLoading && workspaces?.length === 0 && (
                <p className="text-muted-foreground px-2 py-1 text-xs">
                  Nenhum workspace criado.
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
