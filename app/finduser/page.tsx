"use client"
import Loader from "@/components/Loader";
import { findUserByEmail } from "@/lib/findUserByEmail";
import { useEffect, useState } from "react";

const Page = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userFound, setUserFound] = useState(false);
    useEffect(() => {
        const getUser = async () => {
            try {
                const userEmail = 'valorantgusain@gmail.com'; 
                const user = await findUserByEmail(userEmail);
                if (user) {
                    console.log('Found User:', user);
                    console.log('User Api Key')
                    setUserFound(true);
                } else {
                    console.log('User not found');
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error retrieving user by email:', error);
                setIsLoading(false);
            }
        };
        getUser();
    }, [])
    if (isLoading) return <Loader />;

    return (
        <div className='flex flex-col justify-center items-center text-4xl'>
            <div className='text-6xl flex flex-row justify-center items-center text-[#3290EE] '>
                {
                    userFound ? (
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