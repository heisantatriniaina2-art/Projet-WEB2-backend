export type UserRole = 'admin' | 'student';

export interface User {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    role : UserRole;
    isActive : boolean;
}