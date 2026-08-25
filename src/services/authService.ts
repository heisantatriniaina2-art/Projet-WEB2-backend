import bcrypt from "bcrypt";
import { authRepository } from "../repository/authRepository.js";
import { generateToken } from "../security/jwt";

export const authService = {

    login: async (email: string, password: string) => {

        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            const error: any = new Error(
                "Email ou mot de passe incorrect"
            );
            error.status = 401;
            throw error;
        }

        if (!user.isActive) {
            const error: any = new Error(
                "Ce compte est désactivé"
            );
            error.status = 403;
            throw error;
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            const error: any = new Error(
                "Email ou mot de passe incorrect"
            );
            error.status = 401;
            throw error;
        }

        const token = generateToken({
            id: user.id,
            role: user.role
        });

        return {
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        };
    }
};