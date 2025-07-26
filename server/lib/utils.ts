import { prisma } from "../db/client";

export function validatePercentageRules(rules: { type: string, value: number }[]) {
    const allPercent = rules.every(r => r.type === 'PERCENTAGE');

    if (allPercent) {
        const total = rules.reduce((sum, r) => sum + r.value, 0);
        if (total !== 100) {
            throw new Error('Percentage rules must total 100%')
        }
    }
};


export function validatePriorities(rules: { priority: number }[]) {
    const priorities = rules.map(r => r.priority);

    const uniquePriorities = new Set(priorities);

    if (priorities.length !== uniquePriorities.size) {
        throw new Error('Duplicate rule priorities detected. Priorities must be unique per rule group.')
    }
}


export async function evaluateRuleGroup(groupId: string, input: Record<string, any>) {
    const rules = await prisma.rule.findMany({
        where: { groupId },
        orderBy: { priority: 'desc' }
    });


    // loop over all the rules and check if they match
    for (const rule of rules) {
        const passes = evaluateCondition(rule, input);

        if (passes) {
            return {
                matchedRuleId: rule.id,
                outcome: rule.outcome,
                priority: rule.priority
            }
        }
    }


    return { matchedRuleId: null, outcome: null, reason: "No rule matched" }

}


export function evaluateCondition(condition: any, input: Record<string, any>): boolean {
    const { field, operator, value } = condition;

    const actual = input[field];

    switch (operator) {
        case '==': return actual === value;
        case '>=': return actual >= value;
        case '<=': return actual <= value;
        case '!==': return actual !== value;
        case '>': return actual > value;
        case '<': return actual < value;
        default: return false
    }


}