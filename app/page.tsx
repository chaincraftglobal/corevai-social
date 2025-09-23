// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Hello corevai-social 🚀</h1>
      <Button onClick={() => toast.success("AI Agent ready!")}>Click me</Button>
    </main>
  );
}