/**
 * 架構先行、內容後補
 * 角色切換僅為 UI 預留，不實作真實身分驗證或授權邏輯。
 */
export const ROLE_STORAGE_KEY = "sec-portal-role";

export const roles = [
  { id: "employee", label: "一般員工" },
  { id: "operator", label: "廠區操作員" },
  { id: "engineer", label: "工程師" },
  { id: "manager", label: "管理層" },
  { id: "supplier", label: "供應商" },
] as const;

export type RoleId = (typeof roles)[number]["id"];
