import ogImageAssetUrl from "@/assets/og.jpg";

export const siteUrl = "https://zerobyte.app";
export const siteTitle = "Zerobyte | 基于 Restic 的备份自动化工具";
export const siteDescription =
	"Zerobyte 是一个用于 Restic 备份的 Web 控制平面，提供计划调度、加密仓库、监控和恢复工作流。";
export const ogImageUrl = new URL(ogImageAssetUrl, siteUrl).toString();

function getCanonicalUrl(path: string) {
	return new URL(path, siteUrl).toString();
}

export function buildSeoHead({ title, description, path }: { title: string; description: string; path: string }) {
	const canonicalUrl = getCanonicalUrl(path);

	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:url", content: canonicalUrl },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description },
		],
		links: [{ rel: "canonical", href: canonicalUrl }],
	};
}

export function formatDocsTitle(title: string) {
	if (title.toLowerCase().includes("zerobyte")) return title;

	return `${title} | Zerobyte 文档`;
}
