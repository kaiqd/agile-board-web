"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useProject } from "@/hooks/use-projects";

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const isBoardRoute = segments[0] === "board";
  const workspaceId = !isBoardRoute ? segments[0] : undefined;
  const projectId = !isBoardRoute ? segments[1] : undefined;

  const { data: workspace } = useWorkspace(workspaceId ?? "");
  const { data: project } = useProject(workspaceId ?? "", projectId ?? "");

  return (
    <header className="bg-background sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {pathname === "/" ? (
              <BreadcrumbPage>Workspaces</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href="/">Workspaces</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>

          {workspaceId && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {projectId ? (
                  <BreadcrumbLink asChild>
                    <Link href={`/${workspaceId}`}>
                      {workspace?.name ?? "Workspace"}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{workspace?.name ?? "Workspace"}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}

          {projectId && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project?.name ?? "Project"}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}

          {isBoardRoute && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Board</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
