"use server"
import { prisma } from "./prisma";

export async function findUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user; // User object if found, or null if not found
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}
