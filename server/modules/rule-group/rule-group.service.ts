import { prisma } from "../../db/client";
import { validatePercentageRules, validatePriorities } from "../../lib/utils";
import type { createRuleGroupInput, updateRuleGroupInput } from "./rule-group.types";

export const createRuleGroup = async (input: createRuleGroupInput) => {
    const allPercent = input.rules.every(r => r.type === 'PERCENTAGE');

    if (allPercent) {
        const total = input.rules.reduce((sum, r) => sum + r.value, 0);
        if (total !== 100) throw new Error('Percentage rules must total 100%')
    }
    return prisma.$transaction(async tx => {
        const group = await tx.ruleGroup.create({
            data: {
                name: input.name
            }
        });

        const groupId = group.id;

        const enrichedRules = input.rules.map((rule, index) => ({
            ...rule,
            groupId: groupId,
            priority: rule.priority ?? index + 1,
        }))
            .sort((a, b) => b.priority - a.priority)

        // check for duplicates in priority
        const priorities = enrichedRules.map(r => r.priority);
        const uniquePriorities = new Set(priorities);

        if (priorities.length !== uniquePriorities.size) {
            throw new Error(`Duplicate rule priorities detected. Priorities must be unique per rule group.`)
        }


        await tx.rule.createMany({ data: enrichedRules })
    })
}

export const getAllRuleGroups = async () => {
    return await prisma.ruleGroup.findMany();
};


export const getRuleById = async (id: string) => {
    return await prisma.ruleGroup.findUnique({
        where: { id },
        include: {
            rules: true
        }
    })
};


export const updateRuleGroup = async (id: string, input: updateRuleGroupInput) => {
    return prisma.$transaction(async tx => {
        if (input.name) {
            await tx.ruleGroup.update({
                where: {
                    id
                },
                data: {
                    name: input.name
                }
            })
        }

        // handle rule updates
        if (input.rules && input.rules.length > 0) {
            // enrich rules with groupId and priority fallback
            const enrichedRules = input.rules.map((rule, index) => ({
                ...rule,
                groupId: id,
                priority: rule.priority ?? index + 1
            }))
                .sort((a, b) => b.priority - a.priority)

            // percentage validation and duplicate 
            validatePercentageRules(enrichedRules);
            validatePriorities(enrichedRules)

            // delete existing rules
            await tx.rule.deleteMany({
                where: {
                    groupId: id
                }
            })

            // create new rules
            await tx.rule.createMany({
                data: enrichedRules
            })

        }
    })
}




