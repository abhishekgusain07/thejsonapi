"use server"
import { prisma } from "./prisma";

export async function updateApiKeyByEmail(email: string, newApiKeyData: string) {
    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Find the API key associated with the user
        const apiKey = await prisma.apiKey.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!apiKey) {
            throw new Error(`API key for user with email ${email} not found`);
        }

        // Update the API key with new data
        const updatedApiKey = await prisma.apiKey.update({
            where: {
                id: apiKey.id,
            },
            data: {
                key: newApiKeyData, // Assuming the API key has a field named 'key'
            },
        });

        return updatedApiKey; // Return the updated API key object
    } catch (error) {
        console.error('Error updating API key by email:', error);
        throw error;
    }
}
