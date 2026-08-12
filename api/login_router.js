import { getDependency } from "../dependency.js";

export function configureLoginRouter(router) {
    const loginService = getDependency('loginService');

    router.post('/login', async (req, res, next) => {
        try {
            const data = req.body;
            const session = await loginService.login(data);
            res.json(session);
        } catch (error) {
            next(error);
        }
    });
}