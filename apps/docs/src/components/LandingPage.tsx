import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	ArrowRight,
	Bell,
	CalendarClock,
	Check,
	Clock,
	Cloud,
	Container,
	Copy,
	Database,
	FileQuestion,
	HardDrive,
	Layers,
	Lock,
	RotateCcw,
	Settings,
	Shield,
	ShieldCheck,
	Wrench,
	Zap,
	type LucideIcon,
} from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react";
import screenshot1440Url from "@/assets/screenshot-1440.webp";
import screenshot768Url from "@/assets/screenshot-768.webp";

import { CornerCard } from "./CornerCard";
import Footer from "./Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const repoUrl = "https://github.com/nicotsx/zerobyte";

const buttonBaseClass =
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";
const primaryButtonClass = `${buttonBaseClass} h-10 bg-strong-accent px-6 text-white hover:bg-strong-accent/90 focus-visible:ring-strong-accent/50`;
const outlineButtonClass = `${buttonBaseClass} h-10 border border-border bg-background px-6 shadow-xs hover:bg-accent hover:text-accent-foreground`;

const trustItems: Array<{ icon: LucideIcon; label: string }> = [
	{ icon: Shield, label: "开源" },
	{ icon: Database, label: "基于 Restic" },
	{ icon: Lock, label: "端到端加密" },
	{ icon: Layers, label: "增量与去重" },
	{ icon: Cloud, label: "多后端支持" },
];

const problems: Array<{ icon: LucideIcon; text: string }> = [
	{ icon: AlertTriangle, text: "备份任务悄悄失败，直到需要恢复时才发现。" },
	{ icon: Settings, text: "不同的存储后端导致一堆一次性脚本和脆弱的配置。" },
	{ icon: Clock, text: "保留策略被埋没在没人想碰的配置文件里。" },
	{ icon: Wrench, text: "仓库锁和健康问题只在出问题时才显现。" },
	{ icon: FileQuestion, text: "恢复流程从未被测试，直到压力来临时。" },
];

const solutions: Array<{ icon: LucideIcon; title: string; description: string }> = [
	{
		icon: CalendarClock,
		title: "自信地安排计划",
		description:
			"创建基于 cron 的备份计划、保留策略、包含和排除规则，并支持在变更前手动运行额外快照。",
	},
	{
		icon: HardDrive,
		title: "保护任何位置的数据",
		description:
			"从同一界面备份本地目录以及 NFS、SMB/CIFS、WebDAV、SFTP 和 rclone 支持的数据源。",
	},
	{
		icon: Database,
		title: "灵活选择存储",
		description:
			"将加密快照写入本地仓库、S3 兼容存储、Cloudflare R2、Google Cloud Storage、Azure Blob Storage、REST 服务器、SFTP 目标以及通过 rclone 连接的 40+ 提供商。",
	},
	{
		icon: RotateCcw,
		title: "按需恢复",
		description:
			"在 UI 中浏览快照，恢复单个文件、目录或更大路径，无需回到命令行。",
	},
	{
		icon: Bell,
		title: "在问题变成事故前发现它们",
		description:
			"跟踪运行状态、下次备份时间、快照历史、仓库健康度，并通过 Slack、Discord、邮件、ntfy、Telegram、webhook 等发送告警。",
	},
	{
		icon: ShieldCheck,
		title: "安全运维",
		description:
			"Zerobyte 基于组织范围管理，支持角色和邀请，提供基于 OIDC 的 SSO，并在存储前加密敏感凭据。",
	},
];

const features: Array<{ icon: LucideIcon; title: string; description: string }> = [
	{
		icon: Lock,
		title: "天生加密",
		description: "数据在离开源端前即被加密，存储后端永远看不到明文。",
	},
	{
		icon: Zap,
		title: "增量与去重",
		description: "首次运行后，仅传输和存储变更的数据。",
	},
	{
		icon: Settings,
		title: "压缩控制",
		description: "选择自动、关闭或最大压缩，平衡 CPU 时间和存储成本。",
	},
	{
		icon: Copy,
		title: "仓库镜像",
		description: "将快照复制到额外仓库，实现地理冗余或提供商多样化。",
	},
	{
		icon: Wrench,
		title: "仓库维护",
		description: "从 UI 运行 Doctor、解锁过期仓库、刷新仓库统计信息。",
	},
	{
		icon: Container,
		title: "运维友好部署",
		description: "使用 Docker Compose 自行托管，通过你的团队真正能用的 Web 界面管理备份。",
	},
];

const steps = [
	{
		number: "1",
		title: "连接存储卷",
		description: "添加本地目录、NAS 共享、远程文件系统或 rclone 支持的数据源。",
	},
	{
		number: "2",
		title: "创建仓库",
		description:
			"选择加密快照的存储位置，配置压缩、带宽限制或导入已有仓库设置。",
	},
	{
		number: "3",
		title: "设置计划",
		description: "定义备份运行时间、快照保留时长，以及包含或排除的路径。",
	},
	{
		number: "4",
		title: "监控与恢复",
		description:
			"查看备份进度、回顾快照历史、接收通知，并精确恢复你需要的数据。",
	},
];

const benefits = [
	"保留 Restic 的加密、去重和增量快照能力。",
	"获得计划调度、监控、恢复流程、仓库维护和团队访问控制。",
	"自由选择存储后端，不受单一供应商限制。",
];

const faqs = [
	{
		question: "Zerobyte 是备份引擎还是 Restic 的 UI？",
		answer:
			"Zerobyte 是一个基于 Restic 的备份自动化工具。它为您提供一个 Web 控制平面，用于调度、管理、监控、恢复和维护 Restic 备份。",
	},
	{
		question: "Zerobyte 可以备份什么？",
		answer:
			"您可以备份本地目录、NFS 共享、SMB/CIFS 共享、WebDAV 端点、SFTP 位置以及 rclone 支持的数据源。",
	},
	{
		question: "备份数据可以存储在哪里？",
		answer:
			"Zerobyte 支持本地仓库、S3 兼容存储、Cloudflare R2、Google Cloud Storage、Azure Blob Storage、REST 服务器、SFTP 目标，以及通过 rclone 连接的众多其他提供商。",
	},
	{
		question: "我的数据是加密的吗？",
		answer:
			"是的。Zerobyte 依赖 Restic 对仓库数据进行端到端加密，应用程序存储的敏感凭据在写入数据库前也会被加密。",
	},
	{
		question: "可以恢复单个文件吗？",
		answer:
			"可以。您可以通过 Web 界面浏览快照，将单个文件、目录或更大路径恢复到原始位置或其他位置。",
	},
	{
		question: "团队可以使用 Zerobyte 吗？",
		answer:
			"可以。Zerobyte 基于组织范围管理，支持角色、邀请和基于 OIDC 的 SSO 进行访问控制。",
	},
	{
		question: "如何部署？",
		answer: "Zerobyte 设计为自托管，可以使用 Docker Compose 部署。",
	},
];

function BrowserMockup() {
	return (
		<div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
			<div className="relative flex items-center gap-3 border-b border-border bg-secondary/80 px-4 py-2">
				<div className="flex shrink-0 gap-1.5">
					<div className="h-3 w-3 rounded-full bg-red-500" />
					<div className="h-3 w-3 rounded-full bg-yellow-500" />
					<div className="h-3 w-3 rounded-full bg-green-500" />
				</div>
				<div className="min-w-0 flex-1 sm:pointer-events-none sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-center sm:px-20">
					<div className="w-full rounded bg-background/80 px-3 py-0.5 text-center text-xs text-muted-foreground sm:max-w-md">
						localhost:4096
					</div>
				</div>
			</div>
			<div className="aspect-video bg-background/80">
				<img
					src={screenshot1440Url}
					srcSet={`${screenshot768Url} 768w, ${screenshot1440Url} 1440w`}
					sizes="(min-width: 1100px) 55vw, 100vw"
					alt="Zerobyte 备份仪表盘"
					width={1440}
					height={810}
					fetchPriority="high"
					decoding="async"
					className="h-full w-full object-cover object-top"
				/>
			</div>
		</div>
	);
}

export default function LandingPage() {
	return (
		<div data-landing-page className="bg-background text-foreground">
			<main>
				<section className="relative overflow-hidden border-b border-border">
					<div aria-hidden className="landing-hero-docs-grid pointer-events-none absolute inset-0" />
					<div aria-hidden className="landing-hero-glow pointer-events-none absolute inset-0" />
					<div className="relative mx-auto max-w-360 px-4 py-20 sm:px-6 sm:py-24 lg:py-32">
						<div className="grid items-center gap-12 min-[1100px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[1100px]:gap-8 lg:gap-12">
							<div className="text-left">
								<p className="mb-4 text-sm font-medium uppercase tracking-wider text-strong-accent">
									开源备份控制平面
								</p>
								<h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
									让你终于可以忘记的备份
								</h1>
								<p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
									Zerobyte 提供简洁的 Web 界面，让你跨本地磁盘、NAS 共享、远程服务器和云存储，
									轻松调度、监控、恢复和维护加密备份。
								</p>
								<div className="mt-10 flex flex-wrap gap-3">
									<Link to="/docs/$" params={{ _splat: "" }} className={primaryButtonClass}>
										文档
										<ArrowRight className="h-4 w-4" />
									</Link>
									<a href={repoUrl} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
										<GithubLogoIcon className="h-4 w-4" />
										在 GitHub 上查看
									</a>
								</div>
								<p className="mt-6 max-w-xl text-sm text-muted-foreground">
									自托管 · 基于 Restic · 为想要更少脚本和更多可见性的运维人员打造
								</p>
							</div>
							<div className="min-[1100px]:-mr-8 xl:-mr-12">
								<BrowserMockup />
							</div>
						</div>
					</div>
				</section>

				<section className="border-b border-border bg-secondary/30">
					<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
						<div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
							{trustItems.map((item) => (
								<div key={item.label} className="flex items-center gap-2 text-muted-foreground">
									<item.icon className="h-4 w-4 text-strong-accent" />
									<span className="text-sm font-medium">{item.label}</span>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="border-b border-border">
					<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
						<div className="mx-auto max-w-3xl">
							<h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								备份容易开始，难以信赖
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								几条命令和一个 cron 任务就能让备份跑起来。但让它们保持可靠才是真正的难点。
							</p>
							<ul className="mt-10 space-y-5">
								{problems.map((problem) => (
									<li key={problem.text} className="flex items-start gap-4">
										<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
											<problem.icon className="h-3.5 w-3.5 text-muted-foreground" />
										</div>
										<span className="text-muted-foreground">{problem.text}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				<section className="border-b border-border">
					<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Zerobyte 在 Restic 之上构建了真正的控制平面
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								无需拼凑 CLI 命令、cron 和临时监控，从一个地方管理完整的备份生命周期。
							</p>
						</div>
						<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{solutions.map((solution) => (
								<div key={solution.title} className="group">
									<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
										<solution.icon className="h-5 w-5 text-strong-accent" />
									</div>
									<h3 className="text-lg font-semibold text-foreground">{solution.title}</h3>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{solution.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section id="features" className="border-b border-border bg-secondary/20">
					<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								运行严肃备份所需的一切
							</h2>
						</div>
						<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{features.map((feature) => (
								<CornerCard key={feature.title} className="flex h-full flex-col gap-6 py-6">
									<div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-4 px-6">
										<feature.icon className="h-5 w-5 text-strong-accent" />
										<h3 className="leading-none font-semibold text-foreground">{feature.title}</h3>
									</div>
									<div className="px-6">
										<p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
									</div>
								</CornerCard>
							))}
						</div>
					</div>
				</section>

				<section id="how-it-works" className="border-b border-border">
					<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								从数据源到快照，只需四步
							</h2>
						</div>
						<div className="relative mt-16">
							<div className="absolute left-6 top-0 hidden h-full w-px bg-border lg:left-1/2 lg:block" />
							<div className="space-y-8 lg:space-y-12">
								{steps.map((step, index) => (
									<div
										key={step.number}
										className="relative flex flex-col gap-6 pl-16 lg:flex-row lg:items-center lg:gap-12 lg:pl-0"
									>
										<div className={`lg:w-1/2 ${index % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:order-2 lg:pl-12"}`}>
											<h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
											<p className="mt-2 text-muted-foreground">{step.description}</p>
										</div>
										<div className="absolute left-0 top-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background text-lg font-bold text-strong-accent lg:left-1/2 lg:-translate-x-1/2">
											{step.number}
										</div>
										<div className={`hidden lg:block lg:w-1/2 ${index % 2 === 0 ? "lg:order-2" : ""}`} />
									</div>
								))}
							</div>
						</div>
						<div className="mt-16 text-center">
							<Link to="/docs/$" params={{ _splat: "" }} className={outlineButtonClass}>
								阅读文档
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</section>

				<section className="border-b border-border bg-secondary/20">
					<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
						<div className="mx-auto max-w-3xl">
							<h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								为 CLI 强大功能与实际运维之间的鸿沟而生
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Restic 擅长创建安全高效的备份。Zerobyte 让这种能力在日常中变得实用。
							</p>
							<ul className="mt-10 space-y-4">
								{benefits.map((benefit) => (
									<li key={benefit} className="flex items-start gap-4">
										<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-strong-accent/10">
											<Check className="h-3.5 w-3.5 text-strong-accent" />
										</div>
										<span className="text-foreground">{benefit}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				<section id="faq" className="border-b border-border">
					<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
						<div className="mx-auto max-w-3xl">
							<h2 className="text-balance text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								常见问题
							</h2>
							<div className="mt-12">
								<Accordion defaultValue={[faqs[0].question]}>
									{faqs.map((faq) => (
										<AccordionItem key={faq.question} value={faq.question}>
											<AccordionTrigger className="py-4 text-sm font-medium text-foreground hover:text-strong-accent">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent className="pb-4 text-sm text-muted-foreground">{faq.answer}</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</div>
						</div>
					</div>
				</section>

				<section className="border-b border-border">
					<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								别再" babysitting "备份脚本了
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								给你的基础设施一个运维人员真正能用的控制平面。
							</p>
							<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
								<Link to="/docs/$" params={{ _splat: "" }} className={primaryButtonClass}>
									文档
									<ArrowRight className="h-4 w-4" />
								</Link>
								<a href={repoUrl} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
									<GithubLogoIcon className="h-4 w-4" />
									在 GitHub 上查看
								</a>
							</div>
							<p className="mt-8 text-sm text-muted-foreground">
								自托管 Zerobyte，将计划调度、可见性、恢复和仓库维护整合到一个地方。
							</p>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
