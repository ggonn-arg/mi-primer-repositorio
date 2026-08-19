import { getDependency } from "../dependency.js";
import checkRoleMiddleware from "../middlewares/check_role_middleware.js";

export function configureUserRouter(router) {
    const userService = getDependency('userService');

    console.log('Configurando rutas de usuario');

    // 1. GET /users - Solo ADMIN puede ver la lista de usuarios
    router.get('/users', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const users = await userService.getList();
            res.json(users.map(user => ({ 
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                role: user.role
            })));
        } catch (error) {
            next(error);
        }
    });

    // 2. POST /users - Solo ADMIN puede crear nuevos usuarios
    router.post('/users', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const user = req.body; 
            const newUser = await userService.add(user);
            res.json(newUser);
        } catch (error) {
            next(error);
        }
    });

    // 3. DELETE /users/:name - Solo ADMIN puede borrar usuarios
    router.delete('/users/:name', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const name = req.params.name;
            await userService.deleteByName(name);
            res.json({ message: 'Usuario eliminado' });
        } catch (error) {
            next(error);
        }
    });

    // 4. PATCH /users/:name - Solo ADMIN puede actualizar usuarios
    router.patch('/users/:name', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const name = req.params.name;
            const user = req.body;
            await userService.updateByName(name, user);
            res.json({ message: 'Usuario actualizado' });
        } catch (error) {
            next(error);
        }
    });
}