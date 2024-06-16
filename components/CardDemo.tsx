"use client"
import { BellRing, Copy, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { generateApiKey } from "@/lib/generateUser"
import { updateApiKeyByEmail } from "@/lib/updateApiKeyByEmail"
import { findApiKeyByEmail } from "@/lib/findApiKeyByEmail"


type CardProps = React.ComponentProps<typeof Card>

export function CardDemo({ className, ...props }: CardProps) {
  const [apiKey, setApiKey] = useState<string>("")
  const {user} = useUser();
  const imageUrl = user?.imageUrl!;
  const [isClicked, setIsClicked] = useState(false);

  //to load the apikey on the screen after fetching it form the database
  useEffect(() => {
    const getApiKey = async () => {
        try {
            if(!user) {
              throw Error("user is not present")
            }
            const userEmail = user?.primaryEmailAddress?.emailAddress!;
            console.log(userEmail);
            const key = await findApiKeyByEmail(userEmail);
            if (key !== null) {
                console.log(`Api related to ${userEmail} is availaible`);
                setApiKey(key.key)
            } else {
                console.log(`Api related to ${userEmail} not availaible`);
            }
          } catch (error) {
            console.error('Error retrieving user by email:', error);
            throw new Error('Error retrieving user by email')
          }
    };
    getApiKey();
  }, [user])

//  Generate new ApiKey and storing it in database
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  }
  const generateNewApiKey = async() => {
    const userEmail:string  = user?.primaryEmailAddress?.emailAddress as string;
    const newApiKey:string = generateApiKey(64);
    try {
      const newApiKeyObject = await updateApiKeyByEmail(userEmail, newApiKey);
      const newKey = newApiKeyObject.key
      setApiKey(newKey)
    }catch(error) {
      console.log('cannot update apiKey due to some error', error)
      throw new Error("cannot update apiKey due to some error")
    }
  }

  return (
    <MaxWidthWrapper className="">
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader className="flex flex-row justify-between mx-3">
        <div className="flex flex-col gap-y-1 justify-center items-start">
        <CardTitle>{user?.firstName}{" "}{user?.lastName}</CardTitle>
        <CardDescription>{user?.emailAddresses[0].emailAddress}</CardDescription>
        </div>
        <Image src={imageUrl} alt="user image" width={50} height={50} className="rounded-full"/>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications when free API limit ends.
            </p>
          </div>
          <Switch />
        </div>
        <div>
          <div className="mb-4 flex flex-col space-y-2" >
                <div className="flex flex-col items-start justify-center space-y-2">
                  <div className="flex items-center justify-center p-2">
                    <p className="text-sm font-medium ">
                      Api Key
                      </p>
                  </div>
                  <div className="flex flex-row items-center justify-normal p-2">
                    <div className="grid grid-cols-2  items-center">
                      <div className="text-sm text-muted-foreground justify-between mr-3">
                        {apiKey}
                      </div>
                      <div>
                      <Copy onClick={() => copyText(apiKey)} className={`w-4 h-4 transition-transform duration-200 ${isClicked ? 'scale-75' : 'scale-100'}`}/>
                      </div>
                    </div>
                  </div> 
                </div>
                
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={generateNewApiKey}>
          <Zap className="mr-2 h-4 w-4" /> Generate New Api Key
        </Button>
      </CardFooter>
    </Card>
    </MaxWidthWrapper>
  )
}
