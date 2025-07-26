import { prisma } from "../../../db/client";
import { validatePercentageRules } from "../../../lib/utils";
import { ruleGroupSchema } from "../schema/role-group.schema";
import type { ruleGroupInput, updateRuleGroupInput } from "../types/rule-group.types";
import { validateAndEnrich, validatePercentageSplits } from "./validateAndEnrich";

export const createRuleGroup = async (input: ruleGroupInput) => {
    const { name, rules } = input;

    if (!name || !rules || !Array.isArray(rules)) {
        throw new Error(`Invalid payload: 'name' and 'rules' are required`)
    }

    return await prisma.$transaction(async tx => {
        // create the rule group
        const ruleGroup = await tx.ruleGroup.create({
            data: {
                name
            },
            include: {
                rules: true
            }
        });


        // create a rule linked to the group
        for (const rule of rules) {
            const createdRule = await tx.rule.create({
                data: {
                    groupId: ruleGroup.id,
                    priority: rule.priority
                }
            })

            // create conditions
            for (const condition of rule.conditions) {
                await tx.condition.create({
                    data: {
                        ...condition,
                        ruleId: createdRule.id
                    },
                });
            };


            // create outcome if it eexists
            if (rule.outcome) {
                const createdRuleOutcome = await tx.outcome.create({
                    data: {
                        status: rule.outcome.status ?? "PENDING",
                        message: rule.outcome.message,
                        bonus: rule.outcome.bonus,
                        ruleId: createdRule.id
                    }
                })


                // create splits if outcome has splits
                if (rule.outcome.splits && rule.outcome.splits.length > 0) {
                    for (const split of rule.outcome.splits) {
                        const splitRule = await tx.split.create({
                            data: {
                                ...split,
                                outcomeId: createdRuleOutcome.id
                            },
                        })
                    }
                }
            }
        };

        return await tx.ruleGroup.findUnique({
            where: {
                id: ruleGroup.id
            },
            include: {
                rules: {
                    orderBy: {priority: 'asc'},
                    include: {
                        conditions: true,
                        Outcome: {
                            include: {
                                splits: true
                            }
                        }
                    }
                }
            }
        })
    })




}

export const getAllRuleGroups = async () => {
    return await prisma.ruleGroup.findMany();
};


export const getRuleById = async (id: string) => {
    return await prisma.ruleGroup.findUnique({
        where: { id },
        include: {
            rules: {
                include: {
                    conditions: true,
                    Outcome: {
                        include: {
                            splits: true
                        }
                    }
                }
            }
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
            // validatePercentageRules(enrichedRules)
            // priorities validation
            // validatepr(enrichedRules)

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




