import bcrypt from "bcrypt";

import { findUserByEmail } from "../repositories/userRepository.js";
import { generateToken } from "../security/jwt.js";

export async function loginUser(
    email: string,
    password: string
) {
    // Rechercher l'utilisateur
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
        throw new Error("Compte désactivé");
    }

    // Vérifier le mot de passe
    const passwordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        throw new Error("Email ou mot de passe incorrect");
    }

    // Créer le JWT
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    // Ne jamais retourner password_hash au frontend
    return {
        token,
        user: {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`.trim(),
            email: user.email,
            role: user.role,
            isActive: user.is_active
        }
    };
}