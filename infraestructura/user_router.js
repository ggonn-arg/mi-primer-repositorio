import UserService from '../services/user_service.js';

export function configureUserRouter(router) {
    router.get('/users', (req, res) => {
        const userservice = new UserService();
        const data = userService .getUsers();
        res.json({ message: 'List of users', data });

    });
}