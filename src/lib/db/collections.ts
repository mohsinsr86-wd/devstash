import { prisma } from "@/lib/prisma";

export async function getCollections() {
  return prisma.collection.findMany({
    include: {
      items: {
        select: {
          typeId: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getItemTypes() {
  return prisma.itemType.findMany({
    include: {
      _count: {
        select: { items: true },
      },
    },
  });
}

export async function getStats() {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count(),
      prisma.collection.count(),
      prisma.item.count({ where: { isFavorite: true } }),
      prisma.collection.count({ where: { isFavorite: true } }),
    ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}

export async function getRecentCollections() {
  return prisma.collection.findMany({
    take: 5,
    include: {
      items: {
        select: {
          typeId: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}
