"use server"

import { prisma } from "../../prisma"
import { UserInterface, userInterfaceWithApiKey, userInterfaceWithId } from "../../types/types"





export const generateApiKey = (length:number):string=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let apiKey = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      apiKey += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log("apikey:=> ",apiKey)
    return apiKey;
}
export const createUser = async({email, name, clerkUserId}: UserInterface) => {
    try {
        let apiKey = generateApiKey(64)
        console.log("------->"+ typeof apiKey + " <------- ")
        const newUser = await prisma.user.create({
            data: {
              email,
              name,
              clerkUserId,
              apiKey: {
                create: {
                  key: apiKey,
                },
              },
            },
            include: {
                apiKey: true
            }
          });
          console.log(newUser)
        return newUser;
    } catch (error) {
        console.error('User not created in database due to error: ', error);
        throw new Error(`User not created in database due to error: ${error}`);
    }
}


export const deleteUser = async({
    clerkUserId
}:{
    clerkUserId: string
}):Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: {clerkUserId: clerkUserId}
        })
        if(!user){
            throw new Error(`No user found with clerkUserId: ${clerkUserId}`)
        }
        await prisma.apiKey.delete({
            where: {userId: user.id}
        })
        await prisma.user.delete({
            where: {id: user.id}
        })
        console.log(`User with clerkUserId ${clerkUserId} and their API key have been deleted`);
    } catch (error) {
        console.error(`Error deleting user with clerkUserId ${clerkUserId}:`, error);
        throw new Error(`Error deleting user with clerkUserId ${clerkUserId}: ${error}`);
    }   
}

export const findUserByEmail = async({
    email
}:{
    email: string
}):Promise<userInterfaceWithId | null>=> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user; 
    } catch (error) {
        console.error('Error finding user:', error);
        throw new Error(`Error finding user with email ${email}`);
    }
}


export const updateApiKeyByEmail = async ({ email }: { email: string }): Promise<string> => {
    const newApiKey = generateApiKey(64);
    console.log("Generated new API key: ", newApiKey);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { apiKey: true }
        });

        if (!user || !user.apiKey) {
            throw new Error(`User with email ${email} not found`);
        }

        const updatedApiKey = await prisma.apiKey.update({
            where: { id: user.apiKey.id },
            data: { key: newApiKey },
        });

        console.log('Updated API Key:', updatedApiKey);

        const updatedUser = await prisma.user.findUnique({
            where: { email },
            include: { apiKey: true },
        });

        console.log('Updated User:', updatedUser);

        return updatedUser?.apiKey?.key!;
    } catch (error) {
        console.error(`Error updating API key for user with email ${email}:`, error);
        throw new Error(`Error updating API key for user with email ${email}: ${error}`);
    }
}