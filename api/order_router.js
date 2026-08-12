import { getDependency } from '../dependency.js';
import checkRoleMiddleware from '../middlewares/check_role_middleware.js';

export function configureOrderRouter(router) {
    const orderService = getDependency('orderService');

    // Cliente, empleado o admin pueden crear un pedido
    router.post('/orders', checkRoleMiddleware(['admin', 'empleado', 'cliente']), async (req, res, next) => {
        try {
            const order = await orderService.createOrder(req.body, req.session);
            res.json(order);
        } catch (error) {
            next(error);
        }
    });

    // Empleados y admin ven todos los pedidos activos
    router.get('/orders', checkRoleMiddleware(['admin', 'empleado']), async (req, res, next) => {
        try {
            const orders = await orderService.getActiveOrders();
            res.json(orders);
        } catch (error) {
            next(error);
        }
    });

    // Consultar pedidos/cuenta de una mesa específica
    router.get('/orders/mesa/:numeroMesa', checkRoleMiddleware(['admin', 'empleado', 'cliente']), async (req, res, next) => {
        try {
            const orders = await orderService.getOrdersByMesa(req.params.numeroMesa);
            const totalMesa = orders.reduce((sum, ord) => sum + ord.total, 0);
            res.json({ numeroMesa: req.params.numeroMesa, pedidosActivos: orders, totalACobrar: totalMesa });
        } catch (error) {
            next(error);
        }
    });

    // Empleado o Admin cambian el estado del pedido (ej: pasar a 'pagado')
    router.patch('/orders/:id/status', checkRoleMiddleware(['admin', 'empleado']), async (req, res, next) => {
        try {
            const { estado } = req.body;
            const updatedOrder = await orderService.updateStatus(req.params.id, estado);
            res.json(updatedOrder);
        } catch (error) {
            next(error);
        }
    });
}