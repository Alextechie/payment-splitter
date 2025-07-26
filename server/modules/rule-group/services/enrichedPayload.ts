import type z from "zod";
import { ruleGroupSchema } from "../schema/role-group.schema";

export function enrichedAndValidatedGroupPayload(input: unknown): z.infer<typeof ruleGroupSchema> {
    const parsed = ruleGroupSchema.safeParse(input);

    if (!parsed.success) {
        throw new Error("Invalid payload: " + JSON.stringify(parsed.error.format()));
    }


    const enriched = {
        ...parsed.data,
        rules: parsed.data.rules.map((rule, index) => ({
            ...rule,
            priority: rule.priority ?? index,
            outcome: rule.outcome
                ? {
                    status: rule.outcome.status ?? "PENDING",
                    ...rule.outcome
                }
                : undefined,
        })),
    };

    return enriched
}