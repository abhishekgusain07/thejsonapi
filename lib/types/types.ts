export interface UserInterface {
    email: string;
    name?: string | null;
    clerkUserId: string;
}

export interface userInterfaceWithId extends UserInterface {
    id: number;
    name: string | null
}
export interface ApiKey {
    key: string;
    userId: number
}
export interface userInterfaceWithApiKey {
    apiKey: ApiKey
}