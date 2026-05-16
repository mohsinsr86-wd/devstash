import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Sidebar</h2>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-6 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search items..."
              disabled
            />
          </div>
          <Button variant="outline">
            New Collection
          </Button>
          <Button>
            <Plus className="size-4" />
            New Item
          </Button>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <h2 className="text-sm font-semibold text-muted-foreground">Main</h2>
        </div>
      </main>
    </div>
  );
}
