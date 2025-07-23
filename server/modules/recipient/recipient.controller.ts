import * as recipientService from "./recipient.service";
import { createRecipientSchema, updateRecipientSchema } from "./recipient.schema";
import type { Request, Response } from "express";
import { string } from "zod/mini";

export const create = async (req: Request, res: Response) => {
    try {
        // safeparse the req.body
        const parsed = createRecipientSchema.safeParse(req.body);

        if (!parsed.success) return res.status(400).json({
            message: "Invalid input",
            error: parsed.error
        });

        // create a user
        const recipient = await recipientService.createRecipient(parsed.data);

        res.status(201).json({
            messsage: "Recipient Added successfully",
            user: recipient
        })
    } catch (err) {
        res.status(500).json({
            error: 'Failed to create recipient',
            detail: err
        })
    }
}


export const getAll = async (req: Request, res: Response) => {
    const recipients = await recipientService.getAllRecipients();
    return res.status(200).json({
        recipients
    })
}

export const getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const recipient = await recipientService.getRecipientById(String(id));

    if (!recipient) {
        return res.status(404).json({
            message: 'Recipient not found'
        })
    }

    return res.json(recipient)
}

export const update = async (req: Request, res: Response) => {
    const id = req.params.id
    const parsed = updateRecipientSchema.safeParse(req.body);


    if (!parsed.success) return res.status(400).json({
        message: 'Invalid inputs',
        err: parsed.error
    })

    const updated = await recipientService.updateRecipient(String(id), parsed.data);

    return res.status(200).json({
        message: 'Recipient info updated successfully',
        update
    });
};

export const remove = async (req: Request, res: Response) => {
    const id = req.params.id;

    await recipientService.deleteRecipient(String(id));

    res.status(204).send()
}