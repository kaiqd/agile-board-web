"use client";

import { useRouter } from "next/navigation";
import type { Board } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  const router = useRouter();

  return (
    <Card
      className="hover:bg-accent/30 cursor-pointer gap-4 transition-colors"
      onClick={() => router.push(`/board/${board.id}`)}
    >
      <CardHeader className="pb-0">
        <CardTitle className="line-clamp-1 text-base">{board.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Clique para abrir o board</p>
      </CardContent>
    </Card>
  );
}
