import z from "zod";
import { conditionSchema, outcomeSchema } from "../../../lib/extra-schemas";

export const ruleSchema = z.object({
    priority: z.number().int().nonnegative().optional(),
    conditions: z.array(conditionSchema).nonempty(),
    outcome: outcomeSchema
})

export const ruleGroupSchema = z.object({
    name: z.string().min(1, 'Rule group name is required'),
    rules: z.array(ruleSchema),
});


export const updateRuleGroupSchema = z.object({
    name: z.string().min(4),
    rules: z.array(ruleSchema).min(1)
})