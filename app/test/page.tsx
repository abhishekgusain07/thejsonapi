"use client"
import Loader from '@/components/Loader';
import { createUser } from '@/lib/generateUser';
import { prisma } from '@/lib/prisma';
import { neon } from '@neondatabase/serverless';
import { useEffect, useState } from 'react';

const dbUrl: any = process.env.POSTGRESQL_URI;

async function getData() {
  const sql = neon(dbUrl);
  const response = await sql`SELECT version()`;
  return response[0].version;
}

const userDetails = {
  email: "valorantgusain@gmail.com",
  name: "abhishek gusain"
};

async function createUserAndGetData() {
  try {
    const newUser = await createUser(userDetails);
    return { newUser };
  } catch (error) {
    console.error('Error creating user or fetching data:', error);
    throw error;
  }
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createNewUser = async () => {
      try {
        await createUserAndGetData();
        setIsLoading(false);
      } catch (error) {
        console.log('Error creating new User', error);
        setIsLoading(false);
      }
    };
    createNewUser();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className='flex flex-col justify-center items-center text-4xl'>
      <div className='text-6xl flex flex-row justify-center items-center text-[#3290EE] '>
        User created: 
      </div>
    </div>
  );
}
