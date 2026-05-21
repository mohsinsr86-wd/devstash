import { prisma } from "@/lib/prisma";

export async function getPinnedItems() {
  return prisma.item.findMany({
    where: { isPinned: true },
    include: {
      type: { select: { id: true, name: true, icon: true, color: true } },
      collection: { select: { id: true, name: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getRecentItems() {
  return prisma.item.findMany({
    take: 10,
    include: {
      type: { select: { id: true, name: true, icon: true, color: true } },
      collection: { select: { id: true, name: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export type DashboardItem = Awaited<ReturnType<typeof getRecentItems>>[number];
