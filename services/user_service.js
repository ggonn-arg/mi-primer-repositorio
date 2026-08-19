import bcrypt from 'bcrypt';
import { getDependency } from '../dependency.js';

export class UserService {
    constructor() {
        this.userRepo = getDependency('userRepo');
    }

    async getList() {
        return await this.userRepo.find();
    }

    async getByUsername(username) {
        return await this.userRepo.findOne({ username: username });
    }

    async add(userData) {
        // Validaciones básicas
        if (!userData.username) throw new Error('El username es obligatorio');
        if (!userData.password) throw new Error('La contraseña es obligatoria');
        if (!userData.displayName) throw new Error('El displayName es obligatorio');
        if (!userData.email) throw new Error('El email es obligatorio');

        // Verificar si el usuario ya existe
        const existingUser = await this.userRepo.findOne({ username: userData.username });
        if (existingUser) {
            throw new Error(`El usuario ${userData.username} ya existe`);
        }

        // Hashear la contraseña antes de guardar (10 rondas de salt)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const newUser = {
            ...userData,
            password: hashedPassword
        };

        return await this.userRepo.create(newUser);
    }

    async updateByName(username, updateData) {
        const user = await this.userRepo.findOne({ username: username });
        if (!user) throw new Error('Usuario no encontrado');

        // Si se envía una nueva contraseña, la hasheamos también
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        return await this.userRepo.findOneAndUpdate(
            { username: username }, 
            updateData, 
            { new: true }
        );
    }

    async deleteByName(username) {
        const user = await this.userRepo.findOne({ username: username });
        if (!user) throw new Error('Usuario no encontrado');

        await this.userRepo.findOneAndDelete({ username: username });
    }
}