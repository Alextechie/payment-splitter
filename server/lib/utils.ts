import { ru } from "zod/locales";

export function validatePercentageRules(rules: {type: string, value: number}[]){
    const allPercent = rules.every(r => r.type === 'PERCENTAGE');

    if(allPercent){
        const total = rules.reduce((sum, r) => sum + r.value, 0);
        if(total !== 100){
            throw new Error('Percentage rules must total 100%')
        }
    }
};


export function validatePriorities(rules: {priority: number}[]){
    const priorities = rules.map(r => r.priority);

    const uniquePriorities = new Set(priorities);

    if(priorities.length !== uniquePriorities.size){
        throw new Error('Duplicate rule priorities detected. Priorities must be unique per rule group.')
    }
}