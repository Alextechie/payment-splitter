import type { Request, Response } from "express";
import { createRuleGroupSchema, updateRuleGroupSchema } from "./role-group.schema";
import * as ruleGroupService from "./rule-group.service";

export const createGroup = async (req: Request, res: Response) => {
    try {
        const parsed = createRuleGroupSchema.safeParse(req.body);
        if(!parsed.success) return res.status(400).json({
            message: 'Invalid inputs',
            err: parsed.error
        })

        const ruleGroup = await ruleGroupService.createRuleGroup(parsed.data);

        res.status(201).json({
            message: 'Rule group created',
            ruleGroup
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Error creating rule group',
            detail: err
        })
    }
}

export const allRuleGroups = async (req: Request, res: Response) => {
    const allRulegroups = await ruleGroupService.getAllRuleGroups();

    return res.status(200).json({
        allRulegroups
    })
};


export const getRuleGroupById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const ruleGroup = await ruleGroupService.getRuleById(String(id));

    if(!ruleGroup){
        return res.status(404).json({
            message: 'Rule group not found'
        })
    }

    return res.json(ruleGroup)
}


export const updatesRuleGroup = async (req: Request, res: Response) => {
    // input validation for the new ruleGroup
    const parsed = updateRuleGroupSchema.safeParse(req.body);

    if(!parsed.success){
        return res.status(400).json({
            message: 'Invalid inputs',
            err: parsed.error
        })
    }
    const id = req.params.id;

    const updated = await ruleGroupService.updateRuleGroup(String(id), parsed.data);

    return res.status(200).json({
        message: 'Rule group updated successfully',
        updated
    })
}