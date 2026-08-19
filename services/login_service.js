import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { getDependency } from '../dependency.js';

export class LoginService {
    constructor() {
        this.userRepo = getDependency('userRepo');
        this.sessionRepo = getDependency('sessionRepo');
    }

    async login(username, password) {
        const user = await this.userRepo.findOne({ username: username });
        if (!user) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // Comparar contraseña con el hash de bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // Generar token criptográfico
        const token = randomBytes(32).toString('hex');

        // Guardar la sesión con el nombre exacto de campo que espera tu esquema
        await this.sessionRepo.create({
            authorizationToken: token,
            username: user.username,
            role: user.role
        });

        return {
            authorizationToken: token,
            username: user.username,
            role: user.role
        };
    }
}