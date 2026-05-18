import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  await prisma.user.upsert({
    where: { id: "user_001" },
    update: {},
    create: {
      id: "user_001",
      email: "alex@devstash.io",
      isPro: true,
    },
  });
  console.log("  User: Alex Chen");

  const itemTypes = [
    { id: "type_snippet", name: "Snippet", icon: "Code", color: "#3b82f6", isSystem: true },
    { id: "type_prompt", name: "Prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
    { id: "type_note", name: "Note", icon: "FileText", color: "#10b981", isSystem: true },
    { id: "type_command", name: "Command", icon: "Terminal", color: "#f59e0b", isSystem: true },
    { id: "type_file", name: "File", icon: "Folder", color: "#6b7280", isSystem: true },
    { id: "type_image", name: "Image", icon: "Image", color: "#ec4899", isSystem: true },
    { id: "type_url", name: "URL", icon: "Link", color: "#06b6d4", isSystem: true },
  ];

  for (const type of itemTypes) {
    await prisma.itemType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }
  console.log("  Item Types: 7 system types");

  const collections = [
    {
      id: "col_react",
      name: "React Patterns",
      description: "Reusable React component patterns and hooks",
      isFavorite: true,
      userId: "user_001",
    },
    {
      id: "col_python",
      name: "Python Snippets",
      description: "Handy Python utilities and scripts",
      isFavorite: false,
      userId: "user_001",
    },
    {
      id: "col_prompts",
      name: "AI Prompts",
      description: "Curated prompts for coding and debugging",
      isFavorite: true,
      userId: "user_001",
    },
    {
      id: "col_commands",
      name: "Terminal Commands",
      description: "Useful CLI one-liners and scripts",
      isFavorite: false,
      userId: "user_001",
    },
    {
      id: "col_context",
      name: "Context Files",
      description: "Project context, AGENTS.md, and coding standards",
      isFavorite: false,
      userId: "user_001",
    },
    {
      id: "col_git",
      name: "Git Commands",
      description: "Common git workflows, aliases, and troubleshooting",
      isFavorite: true,
      userId: "user_001",
    },
  ];

  for (const col of collections) {
    await prisma.collection.upsert({
      where: { id: col.id },
      update: {},
      create: col,
    });
  }
  console.log("  Collections: 6");

  const items = [
    {
      id: "item_001",
      title: "useDebounce hook",
      contentType: "text",
      content:
        "import { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n\n  return debouncedValue;\n}",
      description: "A custom React hook that debounces a value by a specified delay.",
      isFavorite: true,
      language: "typescript",
      userId: "user_001",
      typeId: "type_snippet",
      collectionId: "col_react",
      tags: ["hooks", "typescript", "performance"],
    },
    {
      id: "item_002",
      title: "Explain this function and suggest improvements",
      contentType: "text",
      content:
        "Paste a function and I'll explain what it does, identify potential bugs, and suggest improvements for readability and performance.",
      description: "AI prompt for code review and improvement suggestions.",
      isFavorite: true,
      language: null,
      userId: "user_001",
      typeId: "type_prompt",
      collectionId: "col_prompts",
      tags: ["ai", "code-review", "prompt"],
    },
    {
      id: "item_003",
      title: "Next.js 16 migration notes",
      contentType: "text",
      content:
        "## Breaking Changes in Next.js 16\n\n- Middleware now runs on Edge runtime by default\n- `appDir` is the only supported directory structure\n- `next/head` removed — use Metadata API\n- Route handlers use standard Web APIs\n- `next/font` is now the default font system",
      description: "Key points from the Next.js 16 migration guide.",
      isFavorite: false,
      language: "markdown",
      userId: "user_001",
      typeId: "type_note",
      collectionId: null,
      tags: ["nextjs", "migration", "reference"],
    },
    {
      id: "item_004",
      title: "Find large files recursively",
      contentType: "text",
      content: "find / -type f -size +100M -exec ls -lh {} \\; 2>/dev/null | sort -k5 -h",
      description: "Lists all files larger than 100MB recursively, sorted by size.",
      isFavorite: false,
      language: "bash",
      userId: "user_001",
      typeId: "type_command",
      collectionId: "col_commands",
      tags: ["linux", "disk-usage", "cli"],
    },
    {
      id: "item_005",
      title: "Tailwind CSS v4 cheat sheet",
      contentType: "text",
      content:
        "## Tailwind v4 Changes\n\n- CSS-first config: use `@import \"tailwindcss\"`\n- No `tailwind.config.*` file\n- `@theme` directive for design tokens\n- Container queries built-in\n- Dynamic utility values with `--value()`",
      description: "Quick reference for Tailwind CSS v4 differences.",
      isFavorite: false,
      isPinned: true,
      language: "markdown",
      userId: "user_001",
      typeId: "type_note",
      collectionId: null,
      tags: ["tailwind", "css", "reference"],
    },
    {
      id: "item_006",
      title: "Generate a REST API endpoint with validation",
      contentType: "text",
      content:
        "Create a TypeScript REST API endpoint using Next.js route handlers with Zod validation, proper error handling, and TypeScript types for request/response.",
      description: "AI prompt for scaffolding API routes with validation.",
      isFavorite: true,
      language: null,
      userId: "user_001",
      typeId: "type_prompt",
      collectionId: "col_prompts",
      tags: ["ai", "api", "typescript", "nextjs"],
    },
    {
      id: "item_007",
      title: "Python list flatten un-nest",
      contentType: "text",
      content:
        "def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result",
      description: "Recursively flattens a nested list of arbitrary depth.",
      isFavorite: false,
      language: "python",
      userId: "user_001",
      typeId: "type_snippet",
      collectionId: "col_python",
      tags: ["python", "recursion", "utilities"],
    },
    {
      id: "item_008",
      title: "Storybook setup guide",
      contentType: "url",
      content: null,
      url: "https://storybook.js.org/docs/react/get-started",
      description: "Official Storybook documentation for React project setup.",
      isFavorite: false,
      language: null,
      userId: "user_001",
      typeId: "type_url",
      collectionId: null,
      tags: ["storybook", "docs", "reference"],
    },
    {
      id: "item_009",
      title: "Prisma reset and reseed",
      contentType: "text",
      content: "npx prisma db push --force-reset && npx prisma db seed",
      description: "Quick command to reset the database and re-run seeds.",
      isFavorite: true,
      language: "bash",
      userId: "user_001",
      typeId: "type_command",
      collectionId: "col_commands",
      tags: ["prisma", "database", "cli"],
    },
    {
      id: "item_010",
      title: "Zustand store pattern",
      contentType: "text",
      content:
        "import { create } from 'zustand';\n\ninterface CounterStore {\n  count: number;\n  increment: () => void;\n  decrement: () => void;\n  reset: () => void;\n}\n\nexport const useCounterStore = create<CounterStore>((set) => ({\n  count: 0,\n  increment: () => set((state) => ({ count: state.count + 1 })),\n  decrement: () => set((state) => ({ count: state.count - 1 })),\n  reset: () => set({ count: 0 }),\n}));",
      description: "Minimal Zustand store boilerplate with TypeScript.",
      isFavorite: false,
      language: "typescript",
      userId: "user_001",
      typeId: "type_snippet",
      collectionId: "col_react",
      tags: ["zustand", "state-management", "typescript"],
    },
    {
      id: "item_011",
      title: "AGENTS.md template",
      contentType: "text",
      content:
        "## Stack\n- Framework\n- Language\n- CSS\n\n## Commands\n| Command | Purpose |\n|---------|---------|\n| dev | Start dev server |",
      description: "Template for project-level AGENTS.md with stack and commands.",
      isFavorite: false,
      language: "markdown",
      userId: "user_001",
      typeId: "type_note",
      collectionId: "col_context",
      tags: ["template", "documentation", "context"],
    },
    {
      id: "item_012",
      title: "ESLint flat config for Next.js",
      contentType: "text",
      content:
        'import { dirname } from "path";\nimport { fileURLToPath } from "url";\nimport { FlatCompat } from "@eslint/eslintrc";\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\n\nconst compat = new FlatCompat({\n  baseDirectory: __dirname,\n});\n\nconst eslintConfig = [\n  ...compat.extends("next/core-web-vitals", "next/typescript"),\n];\n\nexport default eslintConfig;',
      description: "ESLint v9 flat config for Next.js 16 with TypeScript.",
      isFavorite: true,
      language: "typescript",
      userId: "user_001",
      typeId: "type_snippet",
      collectionId: "col_context",
      tags: ["eslint", "nextjs", "typescript", "config"],
    },
    {
      id: "item_013",
      title: "Prettier config",
      contentType: "text",
      content:
        '{\n  "semi": true,\n  "singleQuote": false,\n  "tabWidth": 2,\n  "trailingComma": "es5",\n  "printWidth": 100\n}',
      description: "Standard Prettier configuration for TypeScript projects.",
      isFavorite: false,
      language: "json",
      userId: "user_001",
      typeId: "type_snippet",
      collectionId: "col_context",
      tags: ["prettier", "config", "formatting"],
    },
    {
      id: "item_014",
      title: "Git log with pretty format",
      contentType: "text",
      content: "git log --oneline --graph --decorate --all -20",
      description: "Shows a decorated graph log of the last 20 commits across all branches.",
      isFavorite: true,
      language: "bash",
      userId: "user_001",
      typeId: "type_command",
      collectionId: "col_git",
      tags: ["git", "log", "visualization"],
    },
    {
      id: "item_015",
      title: "Git undo last commit",
      contentType: "text",
      content: "git reset --soft HEAD~1",
      description: "Undo the last commit while keeping changes staged.",
      isFavorite: false,
      language: "bash",
      userId: "user_001",
      typeId: "type_command",
      collectionId: "col_git",
      tags: ["git", "undo", "reset"],
    },
    {
      id: "item_016",
      title: "Git stash pop with conflict resolution",
      contentType: "text",
      content: "git stash pop\n# If conflicts arise:\ngit checkout --theirs .\ngit add .\ngit stash drop",
      description: "Pop stash and resolve merge conflicts by accepting stashed versions.",
      isFavorite: false,
      language: "bash",
      userId: "user_001",
      typeId: "type_command",
      collectionId: "col_git",
      tags: ["git", "stash", "conflicts"],
    },
    {
      id: "item_017",
      title: "Git clean untracked files",
      contentType: "text",
      content: "git clean -fd",
      description: "Force remove all untracked files and directories.",
      isFavorite: false,
      language: "bash",
      userId: "user_001",
      typeId: "type_command",
      collectionId: "col_git",
      tags: ["git", "cleanup", "workspace"],
    },
  ];

  const tagMap = new Map<string, string>();

  for (const item of items) {
    const { tags, ...itemData } = item;

    await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: itemData,
    });

    if (tags) {
      for (const tagName of tags) {
        let tagId = tagMap.get(tagName);
        if (!tagId) {
          const tag = await prisma.tag.upsert({
            where: { id: `tag_${tagName.replace(/\s+/g, "_")}` },
            update: {},
            create: {
              id: `tag_${tagName.replace(/\s+/g, "_")}`,
              name: tagName,
              userId: "user_001",
            },
          });
          tagId = tag.id;
          tagMap.set(tagName, tagId);
        }

        await prisma.itemTag.upsert({
          where: { itemId_tagId: { itemId: item.id, tagId } },
          update: {},
          create: { itemId: item.id, tagId },
        });
      }
    }
  }

  console.log("  Items: 17 (with tags)");
  console.log(`\nSeed complete. ${tagMap.size} unique tags created.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
