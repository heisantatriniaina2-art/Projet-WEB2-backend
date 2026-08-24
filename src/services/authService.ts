import { authRepository } from '../repository/authRepository.js';                                                         

export const authService = {
    login: async (email: string, password: string) => {
        const user = await authRepository.findUserByEmail(email);
        if (!user || !password) {
            throw new Error('User or password not found');
        }
        const isMatch = (password === user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
            }
};