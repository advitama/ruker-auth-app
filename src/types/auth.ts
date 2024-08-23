export type Authenticated = {
    access_token: string;
}

export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    verified: boolean;
}