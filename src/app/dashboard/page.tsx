import { getCollections, getItemTypes, getStats, getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/db/items";
import { DashboardShell } from "./_components/dashboard-shell";

function mapItem(item: Awaited<ReturnType<typeof getRecentItems>>[number]) {
  return {
    id: item.id,
    title: item.title,
    contentType: item.contentType,
    content: item.content,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    url: item.url,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    language: item.language,
    userId: item.userId,
    typeId: item.typeId,
    collectionId: item.collectionId,
    tags: item.tags.map((t) => t.tag.name),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export default async function Dashboard() {
  const [collections, itemTypes, stats, pinnedRaw, recentRaw, recentCollectionsRaw] = await Promise.all([
    getCollections(),
    getItemTypes(),
    getStats(),
    getPinnedItems(),
    getRecentItems(),
    getRecentCollections(),
  ]);

  const pinnedItems = pinnedRaw.map(mapItem);
  const recentItems = recentRaw.map(mapItem);

  const recentCollections = recentCollectionsRaw.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    isFavorite: c.isFavorite,
    userId: c.userId,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  const itemCountByCollection: Record<string, number> = {};
  const collectionTypeMap: Record<
    string,
    { types: Array<{ icon: string; color: string }>; borderColor: string | null }
  > = {};

  for (const col of collections) {
    itemCountByCollection[col.id] = col.items.length;

    const typeFrequency: Record<string, number> = {};
    const typeIcons: Record<string, string> = {};
    const typeColors: Record<string, string> = {};

    for (const item of col.items) {
      const t = itemTypes.find((t) => t.id === item.typeId);
      if (!t) continue;
      typeFrequency[t.id] = (typeFrequency[t.id] || 0) + 1;
      typeIcons[t.id] = t.icon ?? "FileText";
      typeColors[t.id] = t.color ?? "#6b7280";
    }

    const types = Object.entries(typeFrequency)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => ({ icon: typeIcons[id], color: typeColors[id] }));

    collectionTypeMap[col.id] = {
      types,
      borderColor: types.length > 0 ? types[0].color : null,
    };
  }

  const favoriteCollections = collections.filter((c) => c.isFavorite);

  const itemCountByType: Record<string, number> = {};
  for (const t of itemTypes) {
    itemCountByType[t.id] = t._count.items;
  }

  const typeOrder = ["snippet", "command", "image", "note", "file", "link"];
  const sortedItemTypes = [...itemTypes].sort((a, b) => {
    const ai = typeOrder.indexOf(a.name);
    const bi = typeOrder.indexOf(b.name);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const typeMeta = Object.fromEntries(
    sortedItemTypes.map((t) => [t.id, { id: t.id, name: t.name, icon: t.icon ?? "FileText", color: t.color ?? "#6b7280" }])
  );

  const collectionNames = Object.fromEntries(
    collections.map((c) => [c.id, c.name])
  );

  return (
    <DashboardShell
      itemTypes={sortedItemTypes.map((t) => ({ id: t.id, name: t.name, icon: t.icon ?? "FileText", color: t.color ?? "#6b7280", isSystem: t.isSystem, userId: t.userId }))}
      collections={collections.map((c) => ({ id: c.id, name: c.name, description: c.description, isFavorite: c.isFavorite, userId: c.userId, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() }))}
      favoriteCollections={favoriteCollections.map((c) => ({ id: c.id, name: c.name, description: c.description, isFavorite: c.isFavorite, userId: c.userId, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() }))}
      recentCollections={recentCollections}
      itemCountByCollection={itemCountByCollection}
      itemCountByType={itemCountByType}
      pinnedItems={pinnedItems}
      recentItems={recentItems}
      stats={stats}
      collectionNames={collectionNames}
      typeMeta={typeMeta}
      collectionTypeMap={collectionTypeMap}
      currentUser={{
        id: "demo",
        email: "demo@devstash.io",
        name: "Demo User",
        avatarUrl: null,
        isPro: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }}
    />
  );
}
