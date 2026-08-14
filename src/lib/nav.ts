/**
 * 架構先行、內容後補
 * 導航只描述站點結構，不含真實政策或公告標題。
 */
import { routes } from "./paths";

export type NavItem = {
  id: string;
  label: string;
  href: keyof typeof routes;
  hint: string;
};

export const navItems: NavItem[] = [
  { id: "home", label: "首頁", href: "home", hint: "Dashboard 結構" },
  { id: "policies", label: "政策文件庫", href: "policies", hint: "Policies Library" },
  { id: "training", label: "意識與訓練", href: "training", hint: "Awareness & Training" },
  { id: "incident", label: "事件通報", href: "incident", hint: "Incident Reporting" },
  { id: "resources", label: "資源與工具", href: "resources", hint: "Resources" },
  { id: "me", label: "個人儀表板", href: "me", hint: "My Dashboard" },
  { id: "contact", label: "聯絡與組織", href: "contact", hint: "Contact" },
];
