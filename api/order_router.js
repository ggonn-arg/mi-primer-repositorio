import { getDependency } from '../dependency.js';
import checkRoleMiddleware from '../middlewares/check_role_middleware.js';

export function configureOrderRouter(router) {
    const orderService = getDependency('orderService');

    // 1. POST /orders - CREAR PEDIDO (Permitido para CLIENTE y EMPLEADO)
    router.post('/orders', checkRoleMiddleware(['cliente', 'empleado']), async (req, res, next) => {
        try {
            const orderData = req.body;
            const newOrder = await orderService.createOrder(orderData, req.user);
            res.json(newOrder);
        } catch (error) {
            next(error);
        }
    });

    // 2. GET /orders - Ver todos los pedidos activos (SOLO EMPLEADO)
    router.get('/orders', checkRoleMiddleware(['empleado']), async (req, res, next) => {
        try {
            const orders = await orderService.getActiveOrders();
            res.json(orders);
        } catch (error) {
            next(error);
        }
    });

    // 3. GET /orders/mesa/:numeroMesa - Consultar total de una mesa (SOLO EMPLEADO)
    router.get('/orders/mesa/:numeroMesa', checkRoleMiddleware(['empleado']), async (req, res, next) => {
        try {
            const numeroMesa = parseInt(req.params.numeroMesa);
            const orders = await orderService.getOrdersByMesa(numeroMesa);
            
            const totalMesa = orders.reduce((sum, order) => sum + order.total, 0);

            res.json({
                numeroMesa,
                pedidos: orders,
                totalACobrar: totalMesa
            });
        } catch (error) {
            next(error);
        }
    });

    // 4. PATCH /orders/:id/status - Cambiar estado del pedido (SOLO EMPLEADO)
    router.patch('/orders/:id/status', checkRoleMiddleware(['empleado']), async (req, res, next) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            const updatedOrder = await orderService.updateStatus(id, estado);
            res.json(updatedOrder);
        } catch (error) {
            next(error);
        }
    });

    // 5. DELETE /orders/:id - Cancelar/Eliminar pedido (SOLO EMPLEADO)
    router.delete('/orders/:id', checkRoleMiddleware(['empleado']), async (req, res, next) => {
        try {
            const { id } = req.params;
            await orderService.deleteOrder(id);
            res.json({ message: 'Pedido cancelado/eliminado' });
        } catch (error) {
            next(error);
        }
    });
}