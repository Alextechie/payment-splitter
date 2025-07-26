import { number, ZodError } from "zod";
import { ruleGroupSchema } from "../schema/role-group.schema";
import type { ruleGroupInput, RuleInput, Split } from "../types/rule-group.types";
import type { ruleInput } from "../../rule/rule.types";


export const validatePercentageSplits = (splits: Split[], ruleIndex: number): void => {
    const percentageSplits = splits.filter(s => s.type === 'PERCENTAGE');
    const total = percentageSplits.reduce((sum, s) => sum + (s.value ?? 0), 0);

    if (total !== 100) {
        throw new Error(`Total percentage in rule[${ruleIndex}] is ${total}. It must equal 100%`)
    }
};


export const enrichPrioritySplits = (splits: Split[]): Split[] => {
    let autoPriority = 1;

    return splits.map(split => {
        if (split.type === 'PRIORITY' && (split.value === null || split.value === undefined)) {
            return { ...split, priority: autoPriority++ }
        }

        return split
    })
}





// export function validateAndEnrichRules(input: RuleInput[]) {
//     // validate inputs from the ruleInput
//     const parsed = ruleGroupSchema.safeParse(input);


//     if (!parsed.success) {
//         throw new ZodError(parsed.error.issues)
//     };



//     const enrichedRules = parsed.data.rules.map((rule, ruleIndex) => {
//         const splits = rule.outcome.splits;

//         if (!splits || !Array.isArray(splits)) {
//             throw new Error(`Rule at index ${ruleIndex} is missing outcome.splits`)
//         };


//         const recipientSet = new Set<string>();

//         splits.map((split, splitIndex) => {
//             const { recipientId, type } = split;

//             if (!recipientId) {
//                 throw new Error(`Split at rule[${ruleIndex}] split[${splitIndex}] is missing recipientId`)
//             };

//             if (recipientSet.has(recipientId)) {
//                 throw new Error(`Duplicate recipientId ${recipientId} found in rule[${ruleIndex}]`)
//             }
//             recipientSet.add(recipientId);

//             if (!['PERCENTAGE', 'FLAT', 'PRIORITY'].includes(type)) {
//                 throw new Error(`Invalid split type at rule[${ruleIndex}] split[${splitIndex}]`)
//             };


//             if (type === 'PERCENTAGE') {
//                 if (typeof split.value !== "number" || split.value <= 0) {
//                     throw new Error(`Percentage split for recipientId ${recipientId} must be > 0`)
//                 }

//             }

//             if (type === 'FLAT') {
//                 if (typeof split.value !== "number" || split.value <= 0) {
//                     throw new Error(`Flat split for recipientId ${recipientId} must have a valid amount`)
//                 }
//             }

//             let autoPriority = 1;
//             if (type === 'PRIORITY') {
//                 if (typeof split.value !== "number" || split.value === undefined) {
//                     split.value = autoPriority++
//                 }
//             }

//         });


//         // validate percentage sum
//         validatePercentageSplits(splits, ruleIndex)
//         const enrichedSplits = enrichPrioritySplits(splits)


//         return {
//             ...rule,
//             outcome: {
//                 ...rule.outcome,
//                 splits: enrichedSplits
//             }
//         }
//     });

//     return {
//         rules: enrichedRules
//     }
// }



export function validateAndEnrich(input: ruleGroupInput) {
    const parsed = ruleGroupSchema.safeParse(input);

    if (!parsed.success) {
        throw new ZodError(parsed.error.issues)
    }


    const data = parsed.data;

    let rules = data.rules.map((rule, ruleIndex) => {
        const priority = rule.priority ?? ruleIndex + 1;

        // validate bonus and split logic
        const outcome = rule.outcome;

        if (outcome.bonus && (!outcome.splits || outcome.splits.length === 0)) {
            throw new Error(`Rule with priority ${priority} includes a bonus but no splits`)
        }

        // validate and enrich splits
        const splits = outcome?.splits;

        if (splits && splits.length > 0) {
            const recipientSet = new Set();

            let autoPriority = 1;


            outcome.splits = splits.map((split, splitIndex) => {
                const { recipientId, type, value } = split;

                if (!recipientId) {
                    throw new Error(
                        `Split at rule[${ruleIndex}] split[${splitIndex}] is missing recipientId`
                    );
                }

                if (recipientSet.has(recipientId)) {
                    throw new Error(
                        `Duplicate recipientId ${recipientId} found in rule[${ruleIndex}]`
                    );
                }
                recipientSet.add(recipientId);


                if (!["PERCENTAGE", "FLAT", "PRIORITY"].includes(type)) {
                    throw new Error(
                        `Invalid split type at rule[${ruleIndex}] split[${splitIndex}]`
                    );
                }

                if (type === "PERCENTAGE" || type === "FLAT") {
                    if (typeof value !== "number" || value <= 0) {
                        throw new Error(
                            `${type} split for recipientId ${recipientId} must have a value > 0`
                        );
                    }
                }

                if (type === "PRIORITY") {
                    return {
                        ...split,
                        value: typeof value === "number" ? value : autoPriority++,
                    };
                }

                return split
            });
        }

        return {
            ...rule,
            priority
        };
    });

    rules = rules.sort((a, b) => a.priority - b.priority);


    return {
        name: data.name,
        rules
    }
}

