"use client";

import { useParams } from "next/navigation";

export default function BoardPage() {
  const params = useParams<{ boardId: string }>();

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Kanban Board - Em breve</h1>
      <p className="text-muted-foreground text-sm">Board ID: {params.boardId}</p>
    </section>
  );
}
