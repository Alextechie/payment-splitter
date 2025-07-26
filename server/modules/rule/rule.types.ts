import type z from "zod";
import type { createRuleSchema } from "../rule-group/schema/role-group.schema";

export type ruleInput = z.infer<typeof createRuleSchema>

export interface ruleInputs {
    recipientId: string;
    type: 'PERCENTAGE' | 'FLAT' | 'PRIORITY';
    value: number;
    priority: string;
    groupId: string;
}