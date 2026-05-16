"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { itemTypes, collections, currentUser, items } from "@/lib/mock-data";
import {
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Code,
  Sparkles,
  FileText,
  Terminal,
  Folder,
  Image,
  LinkIcon,
  Star,
  ChevronDown,
  ChevronRight,
  Clock,
} from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  Code,
  Sparkles,
  FileText,
  Terminal,
  Folder,
  Image,
  Link: LinkIcon,
};

function UserArea({ collapsed }: { collapsed?: boolean }) {
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (collapsed) {
    return (
      <div className="flex justify-center border-t border-border p-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 border-t border-border px-3 py-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {currentUser.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {currentUser.email}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);

  const closeMobile = () => setMobileOpen(false);

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = [...collections]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  const itemCountByCollection = items.reduce<Record<string, number>>(
    (acc, item) => {
      if (item.collectionId) {
        acc[item.collectionId] = (acc[item.collectionId] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const itemCountByType = items.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.typeId] = (acc[item.typeId] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300",
          "lg:relative lg:translate-x-0",
          sidebarOpen ? "lg:w-64" : "lg:w-14",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div
          className={cn(
            "flex items-center border-b border-border p-3",
            sidebarOpen ? "justify-between" : "justify-center"
          )}
        >
          {sidebarOpen && (
            <span className="text-sm font-semibold text-foreground">
              devstash
            </span>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden shrink-0 lg:inline-flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </Button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          {/* Item Types */}
          <div className="p-2">
            {sidebarOpen && (
              <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Types
              </p>
            )}
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon] || FileText;
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name.toLowerCase()}`}
                  onClick={closeMobile}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                    !sidebarOpen && "justify-center px-0"
                  )}
                >
                  <Icon
                    className="size-4 shrink-0"
                    style={{ color: type.color }}
                  />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 truncate text-foreground">{type.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {itemCountByType[type.id] || 0}
                      </span>
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mx-3 border-t border-border" />

          {/* Collections */}
          <div className="p-2">
            {sidebarOpen ? (
              <button
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted"
              >
                {collectionsOpen ? (
                  <ChevronDown className="size-3 shrink-0" />
                ) : (
                  <ChevronRight className="size-3 shrink-0" />
                )}
                Collections
              </button>
            ) : (
              <div className="flex justify-center">
                <Folder className="size-4 text-muted-foreground" />
              </div>
            )}

            {sidebarOpen && collectionsOpen && (
              <>
                {/* Favorites */}
                <button
                  onClick={() => setFavoritesOpen(!favoritesOpen)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1 pl-6 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted"
                >
                  {favoritesOpen ? (
                    <ChevronDown className="size-3 shrink-0" />
                  ) : (
                    <ChevronRight className="size-3 shrink-0" />
                  )}
                  Favorites
                </button>
                {favoritesOpen &&
                  favoriteCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 pl-10 text-sm transition-colors hover:bg-muted"
                    >
                      <Star className="size-4 shrink-0 text-amber-500" />
                      <span className="flex-1 truncate text-foreground">
                        {col.name}
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {itemCountByCollection[col.id] || 0}
                      </span>
                    </Link>
                  ))}

                {/* Recent */}
                <button
                  onClick={() => setRecentOpen(!recentOpen)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1 pl-6 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted"
                >
                  {recentOpen ? (
                    <ChevronDown className="size-3 shrink-0" />
                  ) : (
                    <ChevronRight className="size-3 shrink-0" />
                  )}
                  Recent
                </button>
                {recentOpen &&
                  recentCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 pl-10 text-sm transition-colors hover:bg-muted"
                    >
                      <Clock className="size-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate text-foreground">
                        {col.name}
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {itemCountByCollection[col.id] || 0}
                      </span>
                    </Link>
                  ))}
              </>
            )}
          </div>
        </div>

        {/* User area */}
        <UserArea collapsed={!sidebarOpen} />
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col min-w-0">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          {/* Mobile drawer trigger */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <PanelLeftOpen className="size-4" />
          </Button>

          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search items..."
              disabled
            />
          </div>
          <Button variant="outline" className="hidden sm:inline-flex">
            New Collection
          </Button>
          <Button>
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Item</span>
          </Button>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <h2 className="text-sm font-semibold text-muted-foreground">Main</h2>
        </div>
      </main>
    </div>
  );
}
