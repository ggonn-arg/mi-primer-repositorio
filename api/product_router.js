import { getDependency } from '../dependency.js';
import checkRoleMiddleware from '../middlewares/check_role_middleware.js';

export function configureProductRouter(router) {
    const productService = getDependency('productService');

    // Ver productos: Permitido para todos los roles logueados
    router.get('/products', checkRoleMiddleware(['cliente', 'empleado', 'admin']), async (req, res, next) => {
        try {
            const products = await productService.getList();
            res.json(products);
        } catch (error) {
            next(error);
        }
    });

    // Crear producto nuevo en la carta: Solo Admin
    router.post('/products', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const product = req.body;
            const newProduct = await productService.add(product);
            res.json(newProduct);
        } catch (error) {
            next(error);
        }
    });
}