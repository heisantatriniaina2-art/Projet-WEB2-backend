export type UserRole = 'admin' | 'student';

export interface User {
    id : number;
    name : string;
    email : string;
    password : string;
    role : UserRole;
    isActive : boolean;
}