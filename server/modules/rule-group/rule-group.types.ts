import z from "zod";
import type { createRuleGroupSchema, updateRuleGroupSchema } from "./role-group.schema";

export type createRuleGroupInput = z.infer<typeof createRuleGroupSchema>
export type updateRuleGroupInput = z.infer<typeof updateRuleGroupSchema>
export type RuleInput = createRuleGroupInput["rules"][number]
