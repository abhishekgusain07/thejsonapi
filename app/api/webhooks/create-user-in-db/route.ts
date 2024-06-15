"use server"
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser } from '@/lib/generateUser';
import { NextResponse } from 'next/server';

interface UserDeatil {
  name: string;
  email: string;
}
async function createUserAndGetData(userDetail:UserDeatil) {
    try {
      const newUser = await createUser(userDetail);
      return { newUser };
    } catch (error) {
      console.error('Error creating user or fetching data:', error);
      throw error;
    }
}

const WEBHOOK_SECRET:string = process.env.WEBHOOK_SECRET || ""
export async function POST(req: Request) {
    console.log('Reached the desired backend route');
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  
  const payload = await req.json()
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.log("svixId", svixId)
    console.log("svixIdTimeStamp", svixIdTimeStamp)
    console.log("svixSignature", svixSignature)
    return new Response("Error occured -- no svix header", {
      status: 400,
    })
  }
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent | null = null

  // Verify the payload with the headers
  try {
    evt = wh.verify(payloadString,{
      "svix-id": svixId,
      "svix-timestamp": svixIdTimeStamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  // Handle the webhook
  const eventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { email_addresses, primary_email_address_id } = evt.data;
    try {
        await createUserAndGetData({email: email_addresses[0].email_address, name: email_addresses[0].email_address});
        return Response.json({
          success: true,
          message: "user entry created in database"
        }, {status: 200})
    } catch(err) {
      return Response.json({
        success: false,
        message: "user entry cannot be created in database"
      }, {status: 400})
    }
  }  
}

