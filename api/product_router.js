import { getDependency } from '../dependency.js';
import checkRoleMiddleware from '../middlewares/check_role_middleware.js';

export function configureProductRouter(router) {
    const productService = getDependency('productService');

    // Clientes, empleados y admin ven los productos disponibles
    router.get('/products', checkRoleMiddleware(['admin', 'empleado', 'cliente']), async (req, res, next) => {
        try {
            const products = await productService.getList();
            res.json(products);
        } catch (error) {
            next(error);
        }
    });

    // Solo admin/empleado pueden crear productos
    router.post('/products', checkRoleMiddleware(['admin', 'empleado']), async (req, res, next) => {
        try {
            const newProduct = await productService.add(req.body);
            res.json(newProduct);
        } catch (error) {
            next(error);
        }
    });

    // Solo admin modifica o elimina productos
    router.patch('/products/:id', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            const updated = await productService.update(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/products/:id', checkRoleMiddleware(['admin']), async (req, res, next) => {
        try {
            await productService.delete(req.params.id);
            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    });
}