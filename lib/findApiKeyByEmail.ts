"use server"
import { prisma } from "./prisma";

export async function findApiKeyByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        const apiKey = await prisma.apiKey.findUnique({
            where: {
              userId: user.id,
            },
          });
        if(!apiKey || !apiKey.key) {
            throw new Error(`apikey related to User with email ${email} not found`);
        }
        return apiKey // Return API key object if found, null if not found
    } catch (error) {
        console.error('Error finding API key by email:', error);
        throw error;
    }
}