import type z from "zod";
import type { createRecipientSchema, updateRecipientSchema } from "./recipient.schema";

export type createRecipienInput = z.infer<typeof createRecipientSchema>
export type updateRecipientInput = z.infer<typeof updateRecipientSchema>