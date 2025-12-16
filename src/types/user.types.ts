import { User } from "./auth.types";

export type UserAuth = Omit<User, "token">;

export interface UpdateProfileData {
    nombre?: string;
    email?: string;
}

