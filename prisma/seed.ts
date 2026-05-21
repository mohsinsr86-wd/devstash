import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  const passwordHash = await hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: { name: "Demo User", password: passwordHash, emailVerified: new Date() },
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log("  User: Demo User (demo@devstash.io)");

  const itemTypes = [
    { id: "type_snippet", name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
    { id: "type_prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
    { id: "type_command", name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
    { id: "type_note", name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
    { id: "type_file", name: "file", icon: "File", color: "#6b7280", isSystem: true },
    { id: "type_image", name: "image", icon: "Image", color: "#ec4899", isSystem: true },
    { id: "type_link", name: "link", icon: "Link", color: "#10b981", isSystem: true },
  ];

  for (const type of itemTypes) {
    await prisma.itemType.upsert({
      where: { id: type.id },
      update: type,
      create: type,
    });
  }
  console.log("  Item Types: 7 system types");

  // --- React Patterns ---
  const reactPatterns = await prisma.collection.upsert({
    where: { id: "col_react_patterns" },
    update: {},
    create: {
      id: "col_react_patterns",
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      isFavorite: true,
      userId: user.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_react_hooks" },
    update: {},
    create: {
      id: "item_react_hooks",
      title: "Custom React Hooks Collection",
      contentType: "text",
      isPinned: true,
      content: `import { useState, useEffect, useCallback, useRef } from 'react';

// Debounce a value by a given delay
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Persist state to localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

// Track previous value of a state
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; });
  return ref.current;
}`,
      description: "Commonly used React hooks: useDebounce, useLocalStorage, usePrevious.",
      language: "typescript",
      userId: user.id,
      typeId: "type_snippet",
      collectionId: reactPatterns.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_react_components" },
    update: {},
    create: {
      id: "item_react_components",
      title: "Compound Components Pattern",
      contentType: "text",
      content: `import { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>');
  return ctx;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 border-b">{children}</div>;
};

Tabs.Tab = function TabsTab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;
  return (
    <button
      className={\`px-4 py-2 border-b-2 \${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent'}\`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  if (activeTab !== id) return null;
  return <div className="p-4">{children}</div>;
};`,
      description: "Compound component pattern using Context API — Tabs with List, Tab, and Panel sub-components.",
      language: "typescript",
      userId: user.id,
      typeId: "type_snippet",
      collectionId: reactPatterns.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_react_utils" },
    update: {},
    create: {
      id: "item_react_utils",
      title: "React Utility Functions",
      contentType: "text",
      content: `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date relative to now
export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return \`\${count} \${label}\${count > 1 ? 's' : ''} ago\`;
  }
  return 'just now';
}

// Truncate text with ellipsis
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}`,
      description: "Handy React utility functions: class merging (cn), relative dates (timeAgo), text truncation.",
      language: "typescript",
      userId: user.id,
      typeId: "type_snippet",
      collectionId: reactPatterns.id,
    },
  });
  console.log("  React Patterns: 3 snippets");

  // --- AI Workflows ---
  const aiWorkflows = await prisma.collection.upsert({
    where: { id: "col_ai_workflows" },
    update: {},
    create: {
      id: "col_ai_workflows",
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      isFavorite: true,
      userId: user.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_ai_review" },
    update: {},
    create: {
      id: "item_ai_review",
      title: "Comprehensive Code Review",
      contentType: "text",
      isPinned: true,
      content: `You are a senior software engineer conducting a thorough code review. Analyze the following code and provide feedback on:

1. **Bugs & Logic Errors** — Identify potential runtime errors, edge cases, and logical flaws.
2. **Performance** — Point out inefficiencies, unnecessary re-renders, and optimization opportunities.
3. **Security** — Flag any security vulnerabilities (XSS, injection, exposed secrets, etc.).
4. **Readability** — Suggest naming improvements, better code organization, and clearer comments.
5. **Best Practices** — Check adherence to framework and language conventions.

For each finding, provide:
- The specific line(s) affected
- Severity: Critical / Medium / Low
- A clear explanation of the issue
- A concrete suggestion with corrected code`,
      description: "AI prompt for performing a detailed code review covering bugs, performance, security, and best practices.",
      language: null,
      userId: user.id,
      typeId: "type_prompt",
      collectionId: aiWorkflows.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_ai_docs" },
    update: {},
    create: {
      id: "item_ai_docs",
      title: "Technical Documentation Generator",
      contentType: "text",
      content: `Generate comprehensive technical documentation for the following codebase. Structure your output as:

## Overview
- What does this module/component do?
- What problem does it solve?

## API Reference
For each public function/component:
- **Signature**: TypeScript type signature
- **Parameters**: Table with name, type, default, description
- **Returns**: Type and description
- **Example**: Minimal usage example

## Dependencies
- List external packages with versions
- Explain why each dependency is needed

## Edge Cases
- Document known limitations
- Error handling behavior
- Performance characteristics

Use clear, concise language. Include code snippets for every example.`,
      description: "AI prompt for generating structured technical documentation with API references, examples, and edge cases.",
      language: null,
      userId: user.id,
      typeId: "type_prompt",
      collectionId: aiWorkflows.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_ai_refactor" },
    update: {},
    create: {
      id: "item_ai_refactor",
      title: "Refactoring Assistant",
      contentType: "text",
      content: `I need to refactor the following code. Please analyze it and provide:

1. **Current Architecture** — Briefly describe the existing structure and patterns.
2. **Smells Identified** — List code smells with line references (duplication, long functions, tight coupling, etc.).
3. **Refactoring Plan** — Step-by-step plan to improve the code without changing behavior.
4. **Refactored Code** — The full refactored code with:
   - Smaller, single-responsibility functions (max 30 lines)
   - Proper TypeScript types (no \`any\`)
   - Early returns instead of nested conditionals
   - Descriptive variable and function names
   - Proper error handling
5. **Testing Strategy** — What tests should be written to verify the refactored code.

Keep the same functionality. Prioritize readability and maintainability.`,
      description: "AI prompt for systematic code refactoring — identifies smells, provides step-by-step plan, and refactored code.",
      language: null,
      userId: user.id,
      typeId: "type_prompt",
      collectionId: aiWorkflows.id,
    },
  });
  console.log("  AI Workflows: 3 prompts");

  // --- DevOps ---
  const devops = await prisma.collection.upsert({
    where: { id: "col_devops" },
    update: {},
    create: {
      id: "col_devops",
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      isFavorite: true,
      userId: user.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_devops_dockerfile" },
    update: {},
    create: {
      id: "item_devops_dockerfile",
      title: "Multi-stage Dockerfile for Next.js",
      contentType: "text",
      isPinned: true,
      content: `# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]`,
      description: "Multi-stage Dockerfile for Next.js with standalone output, optimized for production with minimal image size.",
      language: "docker",
      userId: user.id,
      typeId: "type_snippet",
      collectionId: devops.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_devops_deploy" },
    update: {},
    create: {
      id: "item_devops_deploy",
      title: "Vercel deployment via CLI",
      contentType: "text",
      content: `# Deploy to Vercel with environment variables
vercel deploy \\
  --prod \\
  --env DATABASE_URL="\${DATABASE_URL}" \\
  --env NEXTAUTH_SECRET="\${NEXTAUTH_SECRET}" \\
  --env NEXTAUTH_URL="\${NEXTAUTH_URL}" \\
  --env AUTH_GITHUB_ID="\${AUTH_GITHUB_ID}" \\
  --env AUTH_GITHUB_SECRET="\${AUTH_GITHUB_SECRET}"`,
      description: "Vercel CLI deployment command with environment variable injection for production.",
      language: "bash",
      userId: user.id,
      typeId: "type_command",
      collectionId: devops.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_devops_ghactions" },
    update: {},
    create: {
      id: "item_devops_ghactions",
      title: "GitHub Actions Documentation",
      contentType: "url",
      content: null,
      url: "https://docs.github.com/en/actions",
      description: "Official GitHub Actions documentation — workflows, runners, marketplace actions, and CI/CD guides.",
      language: null,
      userId: user.id,
      typeId: "type_link",
      collectionId: devops.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_devops_dockerdocs" },
    update: {},
    create: {
      id: "item_devops_dockerdocs",
      title: "Docker Compose Reference",
      contentType: "url",
      content: null,
      url: "https://docs.docker.com/compose/compose-file/",
      description: "Complete Docker Compose file reference — services, networks, volumes, and all configuration options.",
      language: null,
      userId: user.id,
      typeId: "type_link",
      collectionId: devops.id,
    },
  });
  console.log("  DevOps: 1 snippet, 1 command, 2 links");

  // --- Terminal Commands ---
  const terminalCommands = await prisma.collection.upsert({
    where: { id: "col_terminal" },
    update: {},
    create: {
      id: "col_terminal",
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_term_git" },
    update: {},
    create: {
      id: "item_term_git",
      title: "Git squash and force push",
      contentType: "text",
      content: `# Squash last 3 commits into one
git rebase -i HEAD~3

# Force push after rebase (use with caution)
git push --force-with-lease origin main`,
      description: "Squash multiple commits into one and safely force push with lease to prevent overwriting remote changes.",
      language: "bash",
      userId: user.id,
      typeId: "type_command",
      collectionId: terminalCommands.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_term_docker" },
    update: {},
    create: {
      id: "item_term_docker",
      title: "Docker cleanup commands",
      contentType: "text",
      content: `# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f

# Remove all unused volumes
docker volume prune -f

# Nuclear: remove everything unused
docker system prune -a -f --volumes`,
      description: "Clean up Docker resources: stopped containers, dangling images, unused volumes, and full system cleanup.",
      language: "bash",
      userId: user.id,
      typeId: "type_command",
      collectionId: terminalCommands.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_term_process" },
    update: {},
    create: {
      id: "item_term_process",
      title: "Find and kill process by port",
      contentType: "text",
      content: `# Linux / macOS
lsof -ti :3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F`,
      description: "Find the process listening on a specific port and forcibly terminate it on Linux, macOS, and Windows.",
      language: "bash",
      userId: user.id,
      typeId: "type_command",
      collectionId: terminalCommands.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_term_pm" },
    update: {},
    create: {
      id: "item_term_pm",
      title: "npm audit and update",
      contentType: "text",
      content: `# Check for vulnerabilities
npm audit

# Auto-fix non-breaking vulnerabilities
npm audit fix

# Force fix all (may include breaking changes)
npm audit fix --force

# Check outdated packages
npm outdated

# Update all packages within semver ranges
npm update`,
      description: "npm commands for auditing vulnerabilities, fixing them, checking outdated packages, and updating dependencies.",
      language: "bash",
      userId: user.id,
      typeId: "type_command",
      collectionId: terminalCommands.id,
    },
  });
  console.log("  Terminal Commands: 4 commands");

  // --- Design Resources ---
  const designResources = await prisma.collection.upsert({
    where: { id: "col_design" },
    update: {},
    create: {
      id: "col_design",
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_design_tailwind" },
    update: {},
    create: {
      id: "item_design_tailwind",
      title: "Tailwind CSS Documentation",
      contentType: "url",
      content: null,
      url: "https://tailwindcss.com/docs",
      description: "Official Tailwind CSS documentation covering utility classes, configuration, and responsive design.",
      language: null,
      userId: user.id,
      typeId: "type_link",
      collectionId: designResources.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_design_shadcn" },
    update: {},
    create: {
      id: "item_design_shadcn",
      title: "shadcn/ui Components",
      contentType: "url",
      content: null,
      url: "https://ui.shadcn.com/docs",
      description: "Beautifully designed components built on Radix UI and Tailwind CSS. Copy, paste, and customize.",
      language: null,
      userId: user.id,
      typeId: "type_link",
      collectionId: designResources.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_design_radix" },
    update: {},
    create: {
      id: "item_design_radix",
      title: "Radix UI Primitives",
      contentType: "url",
      content: null,
      url: "https://www.radix-ui.com/primitives",
      description: "Headless, accessible React primitives for building design systems. Used by shadcn/ui and many component libraries.",
      language: null,
      userId: user.id,
      typeId: "type_link",
      collectionId: designResources.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "item_design_lucide" },
    update: {},
    create: {
      id: "item_design_lucide",
      title: "Lucide Icons",
      contentType: "url",
      content: null,
      url: "https://lucide.dev/icons",
      description: "Beautiful, consistent icon library with 1400+ icons. Tree-shakeable and framework-agnostic.",
      language: null,
      userId: user.id,
      typeId: "type_link",
      collectionId: designResources.id,
    },
  });
  console.log("  Design Resources: 4 links");

  console.log("\nSeed complete: 1 user, 7 types, 5 collections, 16 items.");
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
