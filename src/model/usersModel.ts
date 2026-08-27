export type UserRole = 'admin' | 'student';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
}