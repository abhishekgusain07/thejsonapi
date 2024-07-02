import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser } from '@/lib/dbFunctions/user/user'

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
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
  const eventType = evt.type;

  // //for logging, delete later
  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  // console.log('Webhook body:', body)
  // //---------------------------------

  if(eventType === 'user.created') {
    console.log(`yay reached here ${evt.data}`)
    const {id, email_addresses, first_name} = evt.data
    if(!id || !email_addresses || email_addresses.length === 0) {
      return new Response(`Error occured -- missing data`, {
        status: 400
      })
    }
    const user = {
        name: first_name!,
        email: email_addresses[0].email_address!,
        clerkUserId: id
    }
    try {
      await createUser(user);
        return new Response('User created successfully', {
        status: 200
      });
    }catch(error) {
      console.error('Error creating user:', error);
      return new Response('Error occurred while creating user', {
        status: 500
      });
    }
  }else if(eventType === 'user.deleted') {
    const { id } = evt.data
    if(!id ) {
      return new Response(`Error occured -- missing data`, {
        status: 400
      })
    }
    try{
      const user = deleteUser({clerkUserId: id})
      return new Response(`User with clerkUserId: ${id} deleted`)
    }catch(error) {
      console.log(`Error Deleting user: `, error)
      return new Response(`Error Deleting user`,{status: 500})
    }
  } else if (eventType === 'user.updated') {
    return new Response(`User updated`)
  }
}