import z from "zod";
import type { ruleGroupSchema, updateRuleGroupSchema } from "../schema/role-group.schema";
import type { splitSchema } from "../../../lib/extra-schemas";

export type ruleGroupInput = z.infer<typeof ruleGroupSchema>
export type updateRuleGroupInput = z.infer<typeof updateRuleGroupSchema>
export type RuleInput = ruleGroupInput["rules"][number]
export type Split = z.infer<typeof splitSchema>