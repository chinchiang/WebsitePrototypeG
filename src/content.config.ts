// 架構先行、內容後補
// 內容集合只定義結構與治理欄位，不承載真實政策或訓練全文。
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { governanceSchema } from "./lib/schema";

const policies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/policies" }),
  schema: governanceSchema,
});

const training = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/training" }),
  schema: governanceSchema,
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: governanceSchema,
});

export const collections = { policies, training, resources };
