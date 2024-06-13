"use client"
import Loader from '@/components/Loader';
import { createUser } from '@/lib/generateUser';
import { neon } from '@neondatabase/serverless';
import { useEffect, useState } from 'react';

const dbUrl: any= process.env.POSTGRESQL_URI
async function getData() {
  const sql = neon(dbUrl);
  const response = await sql`SELECT version()`;
  return response[0].version;
}
const userDetails = {
  email:"valorantgusain@gmail.com",
  name:"abhishek gusain"
}

export default async function Page() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const createNewUser = async() => {
      try{
        const newUser = createUser(userDetails);
      }catch(error) {
        console.log('Error creating new User', error)
      }
    }
    createNewUser()
  },[])
  if(isLoading)return <Loader />
  const data = await getData();
  return
    <div className='flex flex-col justify-center items-center text-4xl'>
      <div>
        {data}
      </div>
      <div className='text-6xl flex flex-row justify-center items-center text-[#3290EE] '>
        User created
      </div>
    </div>;
}