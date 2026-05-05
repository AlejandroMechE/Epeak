import { z } from "zod";

export const ProjectSnapshotSchema = z.object({
  meta: z.object({
    lang: z.string(),
    currency: z.string(),
    snapshot_version: z.string(),
    category_id: z.string()
  }),
  core_offer: z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    desc: z.string().optional(),
    features: z.array(z.string()).optional()
  }),
  addons: z.array(z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    desc: z.string().optional()
  })),
  financials: z.object({
    base_price: z.number(),
    addons_total: z.number(),
    total_price: z.number()
  }),
  intelligence: z.object({
    objective: z.string().min(10).max(2000),
    audience: z.string().min(5).max(1000),
    benchmarks: z.string().max(2000).optional(),
    assetLinks: z.string().max(2000).optional()
  }),
  blueprint: z.object({
    architecture_type: z.string(),
    stack: z.array(z.string()),
    custom_needs: z.string().max(2000).optional(),
    recommendation_flag: z.boolean()
  }),
  project_identity: z.object({
    title: z.string().min(5).max(200),
    client_name: z.string().max(200).optional(),
    organization: z.string().max(200).optional()
  }),
  logistics: z.object({
    start_date: z.string(), // YYYY-MM-DD
    endDate: z.string(), // YYYY-MM-DD
    repo_url: z.string().max(1000).optional(),
    comm_channel: z.string(),
    is_private: z.boolean()
  })
});

export type ProjectSnapshot = z.infer<typeof ProjectSnapshotSchema>;
