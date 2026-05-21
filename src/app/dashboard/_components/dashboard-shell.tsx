"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  File,
  Image,
  LinkIcon,
  StickyNote,
  Star,
  ChevronDown,
  ChevronRight,
  Clock,
  Layers,
  Heart,
  Bookmark,
  Pin,
} from "lucide-react";

const iconMap: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  Code,
  Sparkles,
  FileText,
  StickyNote,
  Terminal,
  Folder,
  File,
  Image,
  Link: LinkIcon,
};

interface CollectionData {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardShellProps {
  itemTypes: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    isSystem: boolean;
    userId: string | null;
  }>;
  collections: CollectionData[];
  currentUser: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    isPro: boolean;
    createdAt: string;
    updatedAt: string;
  };
  favoriteCollections: CollectionData[];
  recentCollections: CollectionData[];
  itemCountByCollection: Record<string, number>;
  itemCountByType: Record<string, number>;
  pinnedItems: typeof import("@/lib/mock-data").items;
  recentItems: typeof import("@/lib/mock-data").items;
  stats: {
    totalItems: number;
    totalCollections: number;
    favoriteItems: number;
    favoriteCollections: number;
  };
  collectionNames: Record<string, string>;
  typeMeta: Record<
    string,
    {
      id: string;
      name: string;
      icon: string;
      color: string;
    }
  >;
  collectionTypeMap?: Record<
    string,
    {
      types: Array<{ icon: string; color: string }>;
      borderColor: string | null;
    }
  >;
}

function UserArea({
  currentUser,
  collapsed,
}: {
  currentUser: DashboardShellProps["currentUser"];
  collapsed?: boolean;
}) {
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

export function DashboardShell({
  itemTypes,
  collections,
  currentUser,
  favoriteCollections,
  recentCollections,
  itemCountByCollection,
  itemCountByType,
  pinnedItems,
  recentItems,
  stats,
  collectionNames,
  typeMeta,
  collectionTypeMap = {},
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);

  const closeMobile = () => setMobileOpen(false);

  const statsCards = [
    {
      label: "Total Items",
      value: stats.totalItems,
      icon: Layers,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Collections",
      value: stats.totalCollections,
      icon: Folder,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Favorites",
      value: stats.favoriteItems,
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Fav Collections",
      value: stats.favoriteCollections,
      icon: Bookmark,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

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
                      <span className="flex-1 truncate text-foreground">
                        {type.name}
                      </span>
                      {currentUser.isPro &&
                      (type.name === "file" || type.name === "image") ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4 font-semibold text-muted-foreground/70 border-muted-foreground/20"
                        >
                          PRO
                        </Badge>
                      ) : (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {itemCountByType[type.id] || 0}
                        </span>
                      )}
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
        <UserArea currentUser={currentUser} collapsed={!sidebarOpen} />
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
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                    stat.bg
                  )}
                >
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold tabular-nums text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pinned items */}
          {pinnedItems.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Pinned
              </h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {pinnedItems.map((item) => {
                  const typeInfo = typeMeta[item.typeId];
                  const Icon = typeInfo
                    ? iconMap[typeInfo.icon] || FileText
                    : FileText;
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 hover:border-ring/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: typeInfo
                              ? `${typeInfo.color}15`
                              : undefined,
                          }}
                        >
                          <Icon
                            className="size-4"
                            style={{ color: typeInfo?.color }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Pin className="size-3 shrink-0 text-muted-foreground" />
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.title}
                            </p>
                          </div>
                          {item.collectionId && (
                            <p className="text-xs text-muted-foreground">
                              {collectionNames[item.collectionId] || ""}
                            </p>
                          )}
                        </div>
                      </div>
                      {item.description && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Collections */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Collections
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((col) => {
                const typeInfo = collectionTypeMap[col.id];
                const borderColor = typeInfo?.borderColor;
                return (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className="flex flex-col rounded-xl border bg-card p-5 hover:border-ring/50 transition-colors min-h-[160px]"
                    style={
                      borderColor
                        ? { borderColor: `${borderColor}40` }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {col.name}
                      </p>
                      {col.isFavorite && (
                        <Star className="size-3.5 shrink-0 text-amber-500" />
                      )}
                    </div>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                      {itemCountByCollection[col.id] || 0}
                    </p>
                    {col.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {col.description}
                      </p>
                    )}
                    {typeInfo && typeInfo.types.length > 0 && (
                      <div className="mt-auto flex items-center gap-2 pt-3">
                        {typeInfo.types.map((t, i) => {
                          const Icon = iconMap[t.icon] || FileText;
                          return (
                            <div
                              key={i}
                              className="flex size-7 items-center justify-center rounded"
                              style={{ backgroundColor: `${t.color}20` }}
                            >
                              <Icon
                                className="size-4"
                                style={{ color: t.color }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Recent items */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Recent
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {recentItems.map((item) => {
                const typeInfo = typeMeta[item.typeId];
                const Icon = typeInfo
                  ? iconMap[typeInfo.icon] || FileText
                  : FileText;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 hover:border-ring/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: typeInfo
                            ? `${typeInfo.color}15`
                            : undefined,
                        }}
                      >
                        <Icon
                          className="size-4"
                          style={{ color: typeInfo?.color }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.collectionId && (
                            <span className="text-xs text-muted-foreground">
                              {collectionNames[item.collectionId] || ""}
                            </span>
                          )}
                          {item.language && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {item.language}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.isFavorite && (
                        <Star className="size-4 shrink-0 text-amber-500" />
                      )}
                    </div>
                    {item.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
