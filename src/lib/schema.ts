/**
 * 架構先行、內容後補
 * 內容治理欄位（version / dates / scope / owner）為強制 frontmatter。
 * 不得填入真實政策名稱、主機、IP 或人員資料。
 */
import { z } from "zod";

export const governanceSchema = z.object({
  title: z.string().min(1),
  version: z.string().min(1),
  effectiveDate: z.string().min(1),
  nextReviewDate: z.string().min(1),
  scope: z.array(z.string()).min(1),
  owner: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(["placeholder", "draft", "published"]).default("placeholder"),
  audience: z.array(z.string()).optional(),
  summary: z.string().optional(),
});

export type Governance = z.infer<typeof governanceSchema>;
