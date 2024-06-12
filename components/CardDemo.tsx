"use client"
import { BellRing, Zap } from "lucide-react"

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


type CardProps = React.ComponentProps<typeof Card>

export function CardDemo({ className, ...props }: CardProps) {
  const {user} = useUser();
  const imageUrl = user?.imageUrl!;
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
          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0" >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    title
                  </p>
                  <p className="text-sm text-muted-foreground">
                    description
                  </p>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Zap className="mr-2 h-4 w-4" /> Generate New Api Key
        </Button>
      </CardFooter>
    </Card>
    </MaxWidthWrapper>
  )
}
