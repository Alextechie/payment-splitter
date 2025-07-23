import z from "zod";

export const ruleInputSchema = z.object({
    recipientId: z.uuid(),
    type: z.enum(['PERCENTAGE', 'FLAT', 'PRIORITY']),
    value: z.number().int().positive(),
    priority: z.number().int().nonnegative().optional(),
})

export const createRuleGroupSchema = z.object({
    name: z.string().min(4),
    rules: z.array(ruleInputSchema).min(1)
});


export const updateRuleGroupSchema = z.object({
    name: z.string().min(4),
    rules: z.array(ruleInputSchema).min(1)
})