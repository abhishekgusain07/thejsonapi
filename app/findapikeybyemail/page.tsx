"use client"
import Loader from "@/components/Loader";
import { findApiKeyByEmail } from "@/lib/findApiKeyByEmail";
import { useEffect, useState } from "react";
import { nullable } from "zod";

const Page = () => {
	const [isLoading, setIsLoading] = useState(true);
    const [apiKeyFound, setApiKeyFound] = useState(false);
    useEffect(() => {
        const getApiKey = async () => {
            try {
                const userEmail = 'abhishekgusainofficial@gmail.com'; 
                const key = await findApiKeyByEmail(userEmail);
                if (key !== null) {
                    console.log(`Api related to ${userEmail} is availaible`);
                    console.log(key, key.key)
                    setApiKeyFound(true);
                } else {
                    console.log(`Api related to ${userEmail} not availaible`);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error retrieving user by email:', error);
                setIsLoading(false);
            }
        };
        getApiKey();
    }, [])
    if (isLoading) return <Loader/>;

    return (
        <div className='flex flex-col justify-center items-center text-4xl'>
            <div className='text-6xl flex flex-row justify-center items-center text-[#3290EE] '>
                {
                    apiKeyFound? (
                        <h1 className="text-6xl font-semibold text-blue-500">User Found</h1>
                    ) : (
                        <h2 className="text-6xl font-semibold text-red-500">User Not Found</h2>
                    )
                }
            </div>
        </div>
    );
}

export default Page;