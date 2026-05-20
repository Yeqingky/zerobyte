<div align="center">
  <h1>Zerobyte</h1>
  <h3>为你的远程存储提供强大的备份自动化<br />轻松加密、压缩和保护你的数据</h3>
  <a href="https://github.com/nicotsx/zerobyte/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/nicotsx/zerobyte" />
  </a>
  <br />
  <figure>
    <img src="https://github.com/nicotsx/zerobyte/blob/main/screenshots/backup-details.webp?raw=true" alt="Demo" />
    <figcaption>
      <p align="center">
        带有计划调度和监控的备份管理
      </p>
    </figcaption>
  </figure>
</div>

> [!CAUTION]
> **此 README 由 AI（DeepSeek V3 Flash）自动翻译完成。** 如有不准确或歧义之处，请以英文原版为准。

#### 加入社区

[![Discord](https://img.shields.io/discord/1466834119873925263?label=discord&logo=discord)](https://discord.gg/XjgVyXrcEH)

> [!WARNING]
> Zerobyte 仍处于 0.x.x 版本，各版本之间可能会有重大变化。我正在开发核心功能并收集反馈。如有 Bug 或功能请求，请提交 Issue。

<p align="center">
<a href="https://www.buymeacoffee.com/nicotsx" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
</p>

## 简介

Zerobyte 是一款备份自动化工具，帮助你将数据保存到多个存储后端。它基于 Restic 构建，提供现代化的 Web 界面，用于调度、管理和监控远程存储的加密备份。

## 文档

官方文档网站：[zerobyte.app](https://zerobyte.app)

其中包含最新的设置指南、配置参考以及在生产环境中运行 Zerobyte 的使用文档。

### 功能特性

- **自动备份**：由 Restic 驱动，支持加密、压缩和保留策略
- **灵活调度**：支持自动备份任务，具有精细的保留策略
- **端到端加密**：确保你的数据始终受到保护
- **多协议支持**：支持从 NFS、SMB、WebDAV、SFTP 或本地目录进行备份

## 安装

要运行 Zerobyte，你需要在服务器上安装 Docker 和 Docker Compose。然后使用提供的 `docker-compose.yml` 文件启动应用。

```yaml
services:
  zerobyte:
    image: ghcr.io/nicotsx/zerobyte:v0.36
    container_name: zerobyte
    restart: unless-stopped
    cap_add:
      - SYS_ADMIN
    ports:
      - "4096:4096"
    devices:
      - /dev/fuse:/dev/fuse
    environment:
      - TZ=Europe/Zurich # 在此设置你的时区
      - BASE_URL=http://localhost:4096 # 访问 Zerobyte 的 URL
      - APP_SECRET=94bad46...c66e25d5c2b # 使用 `openssl rand -hex 32` 生成你的密钥
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/lib/zerobyte:/var/lib/zerobyte
```

> [!WARNING]
> 强烈不建议在可从互联网访问的服务器（VPS 或开启了端口转发的家庭服务器）上运行 Zerobyte。如果确实需要，请将端口映射改为 `127.0.0.1:4096:4096`，并使用带有身份验证的安全隧道（SSH 隧道、Cloudflare Tunnel 等）。

> [!WARNING]
> 请勿将 `/var/lib/zerobyte` 指向网络共享位置。否则会遇到权限问题和严重的性能下降。

> [!NOTE]
> **TrueNAS 用户：** TrueNAS 上的主机路径 `/var/lib` 是临时性的，会在系统升级时重置。不要使用 `/var/lib/zerobyte:/var/lib/zerobyte`，请创建专用的 ZFS 数据集（例如 `tank/docker/zerobyte`）并挂载：
>
> ```yaml
> volumes:
>   - /etc/localtime:/etc/localtime:ro
>   - /mnt/tank/docker/zerobyte:/var/lib/zerobyte
> ```
>
> 这样可以确保你的配置、加密密钥和数据库在 TrueNAS 升级后仍然保留。

然后运行以下命令启动 Zerobyte：

```bash
docker compose up -d
```

容器启动后，可以通过 `http://<你的服务器IP>:4096` 访问 Web 界面。

## 配置

Zerobyte 可通过环境变量进行自定义。以下是可用选项：

### 环境变量

| 变量                    | 说明                                                                                                                              | 默认值                  |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :---------------------- |
| `BASE_URL`              | **必填。** Zerobyte 实例的基础 URL（例如 `https://zerobyte.example.com`）。详见下方的[身份验证](#身份验证)。                     | （无）                  |
| `APP_SECRET`            | **必填。** 用于加密数据库中敏感数据的随机密钥（32+ 字符）。使用 `openssl rand -hex 32` 生成。                                    | （无）                  |
| `APP_SECRET_FILE`       | 包含 `APP_SECRET` 的文件路径，适用于 Docker 或 Kubernetes 密钥。与 `APP_SECRET` 互斥。                                           | （无）                  |
| `PORT`                  | Web 界面和 API 的监听端口。                                                                                                       | `4096`                  |
| `RESTIC_HOSTNAME`       | Restic 创建快照时使用的主机名。如果在 Docker 中设置了自定义主机名，会自动检测。                                                   | `zerobyte`              |
| `TZ`                    | 容器的时区（例如 `Asia/Shanghai`）。**对于准确的备份调度至关重要。**                                                              | `UTC`                   |
| `TRUST_PROXY`           | 设为 `true` 时，信任来自反向代理的 `X-Forwarded-For` 头部。直接部署时保持 `false`。                                              | `false`                 |
| `TRUSTED_ORIGINS`       | 允许跨域请求的额外来源列表，逗号分隔（例如 `http://localhost:3000,http://example.com`）。                                        | （无）                  |
| `WEBHOOK_ALLOWED_ORIGINS` | 允许的 HTTP 来源列表（逗号分隔），用于备份 webhook 和出站 HTTP 通知目标。                                                        | （无）                  |
| `WEBHOOK_TIMEOUT`       | 备份 webhook 请求的超时时间（秒）。                                                                                               | `60`                    |
| `LOG_LEVEL`             | 日志详细程度。可选值：`debug`、`info`、`warn`、`error`。                                                                         | `info`                  |
| `SERVER_IDLE_TIMEOUT`   | 服务器空闲超时时间（秒）。                                                                                                        | `60`                    |
| `RCLONE_CONFIG_DIR`     | 容器内 `rclone.conf` 所在目录。如果以非 root 用户运行，需要修改此值。                                                              | `/root/.config/rclone`  |
| `PROVISIONING_PATH`     | 包含运维管理仓库和存储卷的 JSON 文件路径，在启动时同步。                                                                          | （无）                  |

### Webhook 与通知网络策略

备份 webhook 和可指向任意网络主机的出站通知目标受 `WEBHOOK_ALLOWED_ORIGINS` 限制。

允许列表仅匹配精确的来源：协议、主机和端口必须完全匹配。路径会被忽略，因此 `https://hooks.example.com/backups` 允许 `https://hooks.example.com` 上的任何路径，但不允许 `http://hooks.example.com`、`https://hooks.example.com:8443` 或 `https://other.example.com`。

此策略适用于：

- 备份前置/后置 webhook URL
- 通用 HTTP 通知 URL
- Gotify 服务器 URL
- 自托管 ntfy 服务器 URL
- 指向通用 HTTP 或 SMTP 网络目标的自定义 Shoutrrr URL

公共 ntfy.sh 服务和固定提供商的通知服务（如 Slack、Discord、Pushover、Telegram）不需要配置 `WEBHOOK_ALLOWED_ORIGINS`。

备份 webhook 不跟随重定向。请直接将最终目标来源添加到 `WEBHOOK_ALLOWED_ORIGINS` 并配置该最终 URL。

Webhook 头部以明文存储，每行必须使用一个 `Key: Value` 格式。`WEBHOOK_TIMEOUT` 控制备份前置/后置 webhook 请求超时；通知投递使用底层提供商的发送行为。

### 预配置资源

Zerobyte 可以在启动时从 JSON 文件同步运维管理的仓库和存储卷。当你希望凭据或连接信息存在于部署时配置而非通过 UI 输入时，这非常有用。

预配置资源：

- 会出现在常规的仓库和存储卷页面中
- 可以在启动同步时从环境变量或 `/run/secrets/*` 解析凭据字段

完整的预配置文档请访问 [zerobyte.app/docs/guides/provisioning](https://zerobyte.app/docs/guides/provisioning)。

完整示例请参见 `examples/provisioned-resources/README.md`。

### 简化部署（无需远程挂载）

如果只需要备份本地挂载的文件夹，不需要远程共享挂载功能，可以从 `docker-compose.yml` 中移除 `SYS_ADMIN` 能力和 FUSE 设备：

```yaml
services:
  zerobyte:
    image: ghcr.io/nicotsx/zerobyte:v0.36
    container_name: zerobyte
    restart: unless-stopped
    ports:
      - "4096:4096"
    environment:
      - TZ=Europe/Zurich # 在此设置你的时区
      - BASE_URL=http://localhost:4096 # 修改为你的实际 URL（使用 https:// 启用安全 Cookie）
      - APP_SECRET=94bad46...c66e25d5c2b # 使用 `openssl rand -hex 32` 生成你的密钥
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/lib/zerobyte:/var/lib/zerobyte
      - /path/to/your/directory:/mydata
```

**权衡：**

- ✅ 通过减少容器能力提升安全性
- ✅ 支持本地目录作为备份源
- ✅ 支持所有仓库类型，包括本地和远程（S3、GCS、Azure、rclone）
- ❌ 无法直接从 Zerobyte 挂载 NFS、SMB、WebDAV 或 SFTP 共享

如果需要远程挂载能力，请保留原始配置中的 `cap_add: SYS_ADMIN` 和 `devices: /dev/fuse:/dev/fuse`。

## 示例

可运行、可直接复制粘贴的示例请参见 [examples/README.md](examples/README.md)。

## 添加第一个存储卷

Zerobyte 支持多种存储卷后端，包括 NFS、SMB、WebDAV、SFTP 和本地目录。存储卷代表你想要备份和监控的源数据。

要添加第一个存储卷，请导航到 Web 界面中的"存储卷"部分，点击"创建存储卷"。填写所需信息，如存储卷名称、类型和连接设置。

如果你想要备份 Zerobyte 运行主机上的本地目录，首先需要将该目录挂载到 Zerobyte 容器中。可以通过在 `docker-compose.yml` 文件中添加卷映射来实现。例如，要将主机的 `/path/to/your/directory` 挂载到容器的 `/mydata`，请在 `volumes` 部分添加以下行：

```diff
services:
  zerobyte:
    image: ghcr.io/nicotsx/zerobyte:v0.36
    container_name: zerobyte
    restart: unless-stopped
    cap_add:
      - SYS_ADMIN
    ports:
      - "4096:4096"
    devices:
      - /dev/fuse:/dev/fuse
    environment:
      - TZ=Europe/Zurich
      - BASE_URL=http://localhost:4096 # 访问 Zerobyte 的 URL
      - APP_SECRET=94bad46...c66e25d5c2b # 使用 `openssl rand -hex 32` 生成你的密钥
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/lib/zerobyte:/var/lib/zerobyte
+     - /path/to/your/directory:/mydata
```

更新 `docker-compose.yml` 文件后，重启 Zerobyte 容器以应用更改：

```bash
docker compose down
docker compose up -d
```

现在，在 Zerobyte Web 界面中添加新存储卷时，可以选择"目录"作为存储卷类型，并搜索你的挂载路径（例如 `/mydata`）作为源路径。

![添加新存储卷界面](https://github.com/nicotsx/zerobyte/blob/main/screenshots/add-volume.png?raw=true)

## 创建仓库

仓库是你的备份安全加密存储的地方。Zerobyte 为备份仓库支持多种存储后端：

- **本地目录**：将备份存储在 `/var/lib/zerobyte/repositories/` 或任何其他（挂载）路径的子文件夹中
- **S3 兼容存储**：Amazon S3、MinIO、Wasabi、DigitalOcean Spaces 等
- **Google Cloud Storage**：谷歌云存储服务
- **Azure Blob Storage**：微软 Azure 存储
- **rclone 远程存储**：通过 rclone 支持 40+ 云存储提供商（见下文）

仓库针对存储效率和数据完整性进行了优化，利用了 Restic 的去重和加密功能。

要创建仓库，请导航到 Web 界面中的"仓库"部分，点击"创建仓库"。填写所需信息，如仓库名称、类型和连接设置。

### 使用 rclone 进行云存储

Zerobyte 可以使用 [rclone](https://rclone.org/) 支持 40+ 云存储提供商，包括 Google Drive、Dropbox、OneDrive、Box、pCloud、Mega 等。这让你可以灵活地将备份存储到几乎任何云存储服务上。

**设置步骤：**

1. **在主机系统上安装 rclone**（如果尚未安装）：

   ```bash
   curl https://rclone.org/install.sh | sudo bash
   ```

2. **使用 rclone 的交互式配置设置云存储远程**：

   ```bash
   rclone config
   ```

   按照提示设置你的云存储提供商。对于 OAuth 提供商（Google Drive、Dropbox 等），rclone 会引导你完成身份验证流程。

3. **验证远程配置成功**：

   ```bash
   rclone listremotes
   ```

4. **将 rclone 配置挂载到 Zerobyte 容器中**，更新你的 `docker-compose.yml`：

   ```diff
   services:
     zerobyte:
       image: ghcr.io/nicotsx/zerobyte:v0.36
       container_name: zerobyte
       restart: unless-stopped
       cap_add:
         - SYS_ADMIN
       ports:
         - "4096:4096"
       devices:
         - /dev/fuse:/dev/fuse
       environment:
         - TZ=Europe/Zurich
         - BASE_URL=http://localhost:4096 # 访问 Zerobyte 的 URL
       volumes:
         - /etc/localtime:/etc/localtime:ro
         - /var/lib/zerobyte:/var/lib/zerobyte
   +     - ~/.config/rclone:/root/.config/rclone:ro
   ```

   > **非 root 用户注意：** 如果容器以其他用户身份运行（例如 TrueNAS 应用），请将配置挂载到适当位置并设置 `RCLONE_CONFIG_DIR`：
   >
   > ```yaml
   > environment:
   >   - RCLONE_CONFIG_DIR=/home/appuser/.config/rclone
   > volumes:
   >   - ~/.config/rclone:/home/appuser/.config/rclone:ro
   > ```

5. **重启 Zerobyte 容器**：

   ```bash
   docker compose down
   docker compose up -d
   ```

6. **在 Zerobyte 中创建仓库**：
   - 选择"rclone"作为仓库类型
   - 从下拉菜单中选择你配置的远程存储
   - 指定远程存储中的路径（例如 `backups/zerobyte`）

有关支持的提供商完整列表，请参见 [rclone 文档](https://rclone.org/)。

## 第一个备份任务

添加存储卷并创建仓库后，就可以创建第一个备份任务了。备份任务定义了将特定存储卷备份到指定仓库的计划和参数。

创建备份任务时，可以指定以下设置：

- **计划调度**：定义备份运行频率（例如每天、每周）
- **保留策略**：设置备份保留规则（例如每日备份保留 7 天，每周备份保留 4 周）
- **路径**：指定要包含在备份中的文件或目录

配置备份任务后保存，Zerobyte 将按照定义的计划自动执行备份。
你可以在 Web 界面的"备份"部分监控备份任务的进度和状态。

![备份界面](https://github.com/nicotsx/zerobyte/blob/main/screenshots/backups-list.png?raw=true)

## 恢复数据

Zerobyte 允许你轻松从备份中恢复数据。要恢复数据，请导航到"备份"部分，选择要从中恢复数据的备份任务，然后选择特定的备份快照和要恢复的文件或目录。所选数据将恢复到其原始位置。

![恢复界面](https://github.com/nicotsx/zerobyte/blob/main/screenshots/restoring.png?raw=true)

## 身份验证

Zerobyte 使用 [better-auth](https://github.com/better-auth/better-auth) 进行身份验证和会话管理。身份验证系统会自动适应你的部署场景：

### Cookie 安全

- **IP 地址/HTTP 访问**：设置 `BASE_URL=http://192.168.1.50:4096`（或你的 IP）。Cookie 将使用 `Secure: false`，无需 SSL 即可立即登录。
- **域名/HTTPS 访问**：设置 `BASE_URL=https://zerobyte.example.com`。Cookie 将自动使用 `Secure: true`，确保会话安全。

### 反向代理设置

如果你在反向代理（Nginx、Traefik、Caddy 等）后面运行 Zerobyte：

1. **将 `BASE_URL`** 设置为你的 HTTPS 域名（例如 `https://zerobyte.example.com`）
2. 应用程序将根据 `https://` 前缀自动启用安全 Cookie
3. 确保你的代理传递 `X-Forwarded-Proto` 头部

### 重要说明

- `BASE_URL` 必须以 `https://` 开头才能启用安全 Cookie
- 浏览器**不会**将本地 IP 地址（例如 `http://192.168.x.x`）视为安全上下文，因此安全 Cookie 会自动禁用
- `TRUSTED_ORIGINS` 仅允许与认证相关的额外来源。它不会禁用安全 Cookie，也不会在 `BASE_URL` 为 HTTPS 时使 HTTP 认证访问生效
- 如果 `BASE_URL` 是 HTTPS，浏览器将仅通过 HTTPS 发送 Zerobyte 的认证 Cookie。纯 HTTP 访问可能仍会显示登录页面，但由于没有会话 Cookie，认证流程将失败

## 故障排除

常见问题的排查请参考 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) 文件。

## 第三方软件

本项目包含以下第三方软件组件：

### Restic

Zerobyte 包含 [Restic](https://github.com/restic/restic) 用于备份功能。

- **许可证**：BSD 2-Clause License
- **版权**：Copyright (c) 2014, Alexander Neumann &lt;alexander@bumpern.de&gt;
- **状态**：原样包含，未经修改
- **许可文本**：参见 [LICENSES/BSD-2-Clause-Restic.txt](LICENSES/BSD-2-Clause-Restic.txt)

完整的第三方软件许可证和归属信息，请参考 [NOTICES.md](NOTICES.md) 文件。

## 贡献

欢迎任何人贡献！如果你发现 Bug 或有功能请求，请在 GitHub 上提交 Issue。如果你想贡献代码，欢迎 Fork 仓库并提交 Pull Request。我们要求所有贡献者在接受贡献之前签署贡献者许可协议（CLA），这是为了保护你和项目双方。更多详情请参见 [CONTRIBUTING.md](CONTRIBUTING.md) 文件。

## 开发（无需 Docker）

全局安装 Vite+ 后，你可以在开发过程中在本地运行 Zerobyte，无需 Docker：

```bash
vp install
bun run dev
```

对于本地开发，请在仓库根目录创建 `.env.local` 文件并覆盖 Docker 路径：

```bash
# 示例
ZEROBYTE_DATABASE_URL=./data/zerobyte.db
APP_SECRET=your_app_secret_here
RESTIC_PASS_FILE=./data/restic.pass
RESTIC_CACHE_DIR=./data/restic/cache
ZEROBYTE_REPOSITORIES_DIR=./data/repositories
ZEROBYTE_VOLUMES_DIR=./data/volumes
BASE_URL=http://localhost:4096
```

注意：

- 远程挂载后端（NFS/SMB/WebDAV/SFTP）依赖 Linux 挂载工具和 `CAP_SYS_ADMIN`；在 macOS 上预计不可用
- 要实际运行备份/仓库检查，请在你的机器上安装 `restic`（例如通过 Homebrew）。如果未安装 `restic`，应用程序仍可启动，但备份操作将失败并显示明确的错误信息
