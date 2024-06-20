"use server"
import { prisma } from "./prisma";

interface UserInterface {
    email: string;
    name?: string
}
export const generateApiKey = (length:number = 32):string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let apiKey = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      apiKey += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return apiKey;
}
export const createUser = async({email, name}: UserInterface) => {

    const apikey = generateApiKey(64)
    const result = await prisma.$transaction(async(prisma) => {
        try{
            const user = await prisma.user.create({
                data: {
                   name, 
                   email 
                }
            });
            const apiKeyRecord = await prisma.apiKey.create({
                data: {
                    key: apikey,
                    userId: user.id
                }
            })
            const returnObject = {user, apiKey: apiKeyRecord.key}
            console.log(returnObject);
            return {
                user,
                apikey:apiKeyRecord.key
            }
        }catch(error) {
            console.log('User not created in database due to error: ', error)
            throw new Error('User not created in database due to error')
        }
    })
    // try{
    //     const newUser = await prisma.user.create({
    //         data: {
    //             email:email,
    //             name: name
    //         },
    //     });
    //     const apiKey:string = generateApiKey(64);

    //     const newApiKey = await prisma.apiKey.create({
    //         data: {
    //             key: apiKey,
    //             user: {
    //                 connect: {id: newUser.id}
    //             }
    //         }
    //     })
    //     console.log('created User:', newUser);
    //     console.log('Created ApiKey:', newApiKey)
    //     return {newUser, newApiKey}
    // }catch(error){
    //     console.log("user not created in database due to some issue: ", error);
    // }
}

