import z from "zod";

export const conditionSchema = z.object({
    field: z.string().min(1),
    operator: z.enum(['=', '<', '>', '<=', '>=', '!==', 'IN', 'NOT IN']),
    value: z.union([z.string(), z.number(), z.boolean(), z.array(z.any())])
});


export const percentageSplit = z.object({
    recipientId: z.string(),
    type: z.literal('PERCENTAGE'),
    value: z.number().min(0).max(100)
})


export const flatSplit = z.object({
    recipientId: z.string(),
    type: z.literal('FLAT'),
    value: z.number().positive(),
})


export const prioritySplit = z.object({
    recipientId: z.string(),
    type: z.literal('PRIORITY'),
    value: z.number().int().positive(),
})

export const splitSchema = z.discriminatedUnion('type', [
    percentageSplit,
    flatSplit,
    prioritySplit
])


export const outcomeSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'PENDING']).optional(),
    bonus: z.number().min(1).optional(),
    message: z.string().optional(),
    splits: z.array(splitSchema).optional()
})