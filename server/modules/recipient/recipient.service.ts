import { prisma } from "../../db/client";
import type { createRecipienInput, updateRecipientInput } from "./recipient.types";

export const createRecipient = async (data: createRecipienInput) => {
    return await prisma.recipient.create({ data })
};

export const getAllRecipients = async () => {
    return await prisma.recipient.findMany();
};

export const getRecipientById = async (id: string) => {
    return await prisma.recipient.findUnique({ where: { id } })
}


export const updateRecipient = async (id: string, data: updateRecipientInput) => {
    return await prisma.recipient.update({ where: { id }, data })
}

export const deleteRecipient = async (id: string) => {
    return await prisma.recipient.delete({ where: { id } })
}
