## Important instructions

- Never create migration files manually. Always use the provided command to generate migrations
- If you realize an automated migration is incorrect, make sure to remove all the associated entries from the `_journal.json` and the newly created files located in `app/drizzle/` before re-generating the migration
- The dev server is running at http://localhost:3000. Username is `admin` and password is `password`
- The repo is https://github.com/nicotsx/zerobyte
- If you need to run a specific restic command on a repository, you can open and use the dev panel with `Meta+Shift+D`

## Project Overview

Zerobyte is a backup automation tool built on top of Restic that provides a web interface for scheduling, managing, and monitoring encrypted backups. It supports multiple volume backends (NFS, SMB, WebDAV, SFTP, local directories) and repository backends (S3, Azure, GCS, local, and rclone-based storage).

### Type Checking

```bash
# Run type checking and generate React Router types
bun run tsc
```

### Testing

```bash
# Run all tests
bun run test

# Run a specific test file
bunx dotenv-cli -e .env.test -- bunx --bun vitest run --project server path/to/test.ts
```

### Building

```bash
# Build for production
bun run build
```

### Database Migrations

```bash
# Generate new migration from schema changes
bun gen:migrations

# Generate a custom empty migration
bunx drizzle-kit generate --custom --name=fix-timestamps-to-ms

```

### API Client Generation

```bash
bun run gen:api-client
```

### Code Quality

```bash
# Format
vp fmt <path> --write

# Lint
bun run lint
```

### Invalidation

The frontend has an automatic invalidation setup which runs after every mutation.
Do not implement any invalidation logic in the frontend.

## Project Structure

```
zerobyte/
├── app/                          # 主应用（monorepo 根目录）
│   ├── client/                   # 前端（React Router + TanStack Query）
│   │   ├── api-client/           # 自动生成的 API 客户端 (openapi-ts)
│   │   ├── components/           # 共享 UI 组件
│   │   │   ├── ui/               # shadcn/ui 基础组件
│   │   │   ├── file-browsers/    # 文件浏览器组件
│   │   │   └── ...
│   │   ├── hooks/                # 自定义 React Hooks
│   │   ├── lib/                  # 客户端工具库
│   │   ├── modules/              # 功能模块
│   │   │   ├── admin/            # 管理面板
│   │   │   ├── auth/             # 认证
│   │   │   ├── backups/          # 备份计划与执行
│   │   │   ├── notifications/    # 通知渠道
│   │   │   ├── repositories/     # 仓库管理
│   │   │   ├── settings/         # 用户/组织设置
│   │   │   ├── sso/              # SSO 提供商
│   │   │   └── volumes/          # 卷管理
│   │   └── ...
│   ├── server/                   # 后端（Hono + Drizzle ORM）
│   │   ├── cli/                  # CLI 命令（密码重置、2FA 等）
│   │   ├── core/                 # 核心服务（配置、调度器、事件、restic）
│   │   ├── db/                   # 数据库 schema 与关系（Drizzle）
│   │   ├── jobs/                 # 后台任务（备份执行、清理）
│   │   ├── lib/                  # 服务端工具库（认证、中间件）
│   │   ├── modules/              # 功能模块
│   │   │   ├── agents/           # 远程代理管理
│   │   │   ├── auth/             # 认证与会话
│   │   │   ├── backups/          # 备份逻辑与调度
│   │   │   ├── events/           # 服务端推送事件
│   │   │   ├── lifecycle/        # 启动/关闭/迁移
│   │   │   ├── notifications/    # 通知构建与发送
│   │   │   ├── provisioning/     # 自动配置
│   │   │   ├── repositories/     # 仓库 CRUD 与操作
│   │   │   ├── sso/              # SSO 集成 (OIDC)
│   │   │   ├── system/           # 系统信息
│   │   │   └── volumes/          # 卷 CRUD
│   │   ├── plugins/              # Hono 插件
│   │   ├── utils/                # 后端工具函数
│   │   └── __tests__/            # 集成测试
│   ├── routes/                   # React Router 文件路由
│   ├── schemas/                  # 共享 Zod Schema
│   ├── test/                     # 测试配置与助手
│   ├── utils/                    # 共享工具函数（format-bytes, prefetch）
│   ├── drizzle/                  # 数据库迁移文件
│   ├── middleware/                # Hono 中间件（认证、api-client）
│   ├── lib/                      # 共享库（auth-routes, request-client）
│   ├── routeTree.gen.ts          # 自动生成的路由树
│   └── router.tsx                # 路由配置
├── apps/
│   ├── agent/                    # 远程备份代理（在远程主机运行）
│   │   └── src/
│   │       ├── commands/         # 代理命令（备份、心跳）
│   │       ├── jobs/             # 清理任务
│   │       ├── restic/           # 代理的 Restic 集成
│   │       └── volume-host/      # 卷挂载后端（NFS, SMB 等）
│   └── docs/                     # 文档站点（Nextra/Fumadocs）
│       ├── content/docs/         # MDX 文档
│       ├── public/               # 静态资源
│       └── src/                  # 文档站点源码
├── packages/
│   ├── contracts/                # 共享类型契约（代理协议、卷）
│   └── core/                     # 核心库
│       └── src/
│           ├── backup-hooks/     # 备份前后钩子系统
│           ├── node/             # Node.js 工具（fs, spawn, logger）
│           ├── restic/           # Restic 命令定义与 DTO
│           └── utils/            # 共享工具（path, sanitize, json）
├── e2e/                          # Playwright 端到端测试
├── playwright/                   # Playwright 认证设置 (tinyauth)
├── examples/                     # Docker Compose 部署示例
│   ├── basic-docker-compose/
│   ├── directory-bind-mount/
│   ├── provisioned-resources/
│   ├── rclone-config-mount/
│   ├── simplified-docker-compose/
│   └── tailscale-sidecar/
├── scripts/                      # 构建与开发脚本
├── screenshots/                  # README 截图
├── public/                       # 公共资源（favicon, 图片）
├── assets/                       # 应用资源（logo）
├── tests/                        # 后端集成测试
├── .github/                      # GitHub Actions 与模板
└── ...config files               # tsconfig, vite.config, docker-compose 等
```
