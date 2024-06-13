"use server"
import { prisma } from "./prisma";

interface UserInterface {
    email: string;
    name?: string
}
const generateApiKey = (length:number = 32):string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let apiKey = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      apiKey += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return apiKey;
}
export const createUser = async({email, name}: UserInterface) => {
    try{
        const newUser = await prisma.user.create({
            data: {
                email:email,
                name: name
            },
        });
        const apiKey:string = generateApiKey(64);

        const newApiKey = await prisma.apiKey.create({
            data: {
                key: apiKey,
                user: {
                    connect: {id: newUser.id}
                }
            }
        })
        console.log('created User:', newUser);
        console.log('Created ApiKey:', newApiKey)
        return {newUser, newApiKey}
    }catch(error){
        console.log("user not created in database due to some issue: ", error);
    }
        
}

