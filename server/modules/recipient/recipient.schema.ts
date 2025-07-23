import z from "zod";

export const createRecipientSchema = z.object({
    name: z.string().min(4, 'Name should have atleast 4 characters').trim(),
    account: z.string().min(10, 'Should be atleast 10 digits')
})

export const updateRecipientSchema = z.object({
    name: z.string().min(2).optional(),
    account: z.string().min(10, 'Account detail should have atleast 10 digits').max(12).optional()
})