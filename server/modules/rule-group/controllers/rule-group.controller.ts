import type { Request, Response } from "express";
import { ruleGroupSchema, updateRuleGroupSchema } from "../schema/role-group.schema";
import * as ruleGroupService from "../services/rule-group.service";
import { ZodError } from "zod";
import { validateAndEnrich } from "../services/validateAndEnrich";

export const createGroup = async (req: Request, res: Response) => {
    const parsed = ruleGroupSchema.safeParse(req.body);


    if(!parsed.success){
        return res.status(400).json({
            message: "Invalid inputs",
            err: parsed.error.format()
        })
    }

    const enrichedInput = validateAndEnrich(parsed.data)

    try {

        const ruleGroup = await ruleGroupService.createRuleGroup(enrichedInput);

        return res.status(201).json({
            message: 'Rule group created succesfully',
            ruleGroup
        })

    } catch (err) {

        if(err instanceof ZodError){
            res.status(400).json(err.message)
        } else {
            res.status(500).json({
                message: "Internal server error"
            })
        }

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

    if (!ruleGroup) {
        return res.status(404).json({
            message: 'Rule group not found'
        })
    }

    return res.json(ruleGroup)
}


export const updatesRuleGroup = async (req: Request, res: Response) => {
    // input validation for the new ruleGroup
    const parsed = updateRuleGroupSchema.safeParse(req.body);

    if (!parsed.success) {
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