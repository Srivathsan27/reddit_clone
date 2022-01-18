import { User } from "../entities/User";
import { UserPassInput } from "../InputTypes/userPassInput";
import { MyContext } from "../types/MyContext";
declare class FieldError {
    field: string;
    message: string;
}
declare class UserResponse {
    errors?: FieldError[];
    user?: User;
}
export declare class UserResolver {
    users({ em }: MyContext): Promise<User[] | null>;
    register({ em, req }: MyContext, input: UserPassInput): Promise<UserResponse>;
    login({ em, req }: MyContext, input: UserPassInput): Promise<UserResponse>;
    me({ em, req }: MyContext): Promise<User | null>;
    logout({ req, res }: MyContext): Promise<Boolean>;
}
export {};
