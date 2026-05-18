import { itemTypes, collections, currentUser, items } from "@/lib/mock-data";
import { DashboardShell } from "./_components/dashboard-shell";

export default function Dashboard() {
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

  const pinnedItems = items.filter((i) => i.isPinned);
  const recentItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 10);
  const favoriteItemCount = items.filter((i) => i.isFavorite).length;

  const collectionNames = Object.fromEntries(
    collections.map((c) => [c.id, c.name])
  );
  const typeMeta = Object.fromEntries(
    itemTypes.map((t) => [t.id, t])
  );

  return (
    <DashboardShell
      itemTypes={itemTypes}
      collections={collections}
      currentUser={currentUser}
      favoriteCollections={favoriteCollections}
      recentCollections={recentCollections}
      itemCountByCollection={itemCountByCollection}
      itemCountByType={itemCountByType}
      pinnedItems={pinnedItems}
      recentItems={recentItems}
      stats={{
        totalItems: items.length,
        totalCollections: collections.length,
        favoriteItems: favoriteItemCount,
        favoriteCollections: favoriteCollections.length,
      }}
      collectionNames={collectionNames}
      typeMeta={typeMeta}
    />
  );
}
