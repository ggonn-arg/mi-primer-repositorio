import { getDependency } from "../dependency.js";
import checkRoleMiddleware from "../middlewares/check_role_middleware.js";

export function configureUserRouter(router) {
    const userService = getDependency('userService');

    console.log('Configurando rutas de usuario');

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

    router.post('/users', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const user = req.body; 
            const newUser = await userService.add(user);
            res.json(newUser);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/users/:name', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const name = req.params.name;
            await userService.deleteByName(name);
            res.json({ message: 'Usuario eliminado' });
        } catch (error) {
            next(error);
        }
    });

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