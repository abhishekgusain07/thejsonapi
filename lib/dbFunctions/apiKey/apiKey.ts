"use server";
import { prisma } from "../../prisma";

export async function findApiKeyByEmail(email: string):Promise<string | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: {apiKey: true}
        });
        if (!user || !user.apiKey) {
            throw new Error(`ApiKey not found of user with emailId: ${email}`);
        }
        return user.apiKey.key
    } catch (error) {
        console.error('Error finding API key by email:', error);
        throw error;
    }
}