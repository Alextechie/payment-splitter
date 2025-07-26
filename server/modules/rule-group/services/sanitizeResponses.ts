import type { ruleGroupInput } from "../types/rule-group.types";

export function sanitizeRuleGroupResponse(ruleGroup: ruleGroupInput){
    return {
        name: ruleGroup.name,
        rules: ruleGroup.rules.map((rule) => ({
            priority: rule.priority,
            conditions: rule.conditions,
            outcome: rule.outcome
            ? {
                status: rule.outcome.status,
                message: rule.outcome.message,
                bonus: rule.outcome.message,
                splits: rule.outcome.splits
            }
            : undefined
        }))
    }
}