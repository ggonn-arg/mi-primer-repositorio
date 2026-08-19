import { getDependency } from '../dependency.js';

export class OrderService {
    constructor() {
        this.orderRepo = getDependency('orderRepo');
        this.productRepo = getDependency('productRepo');
    }

    async createOrder(orderData, sessionUser) {
        if (!orderData.numeroMesa) throw new Error('El número de mesa es obligatorio');
        if (!orderData.items || !orderData.items.length) throw new Error('El pedido debe tener al menos un producto');

        let totalCalculado = 0;
        const itemsProcesados = [];

        for (const item of orderData.items) {
            const product = await this.productRepo.findById(item.productoId);
            if (!product) throw new Error(`El producto con ID ${item.productoId} no existe`);
            if (!product.disponible) throw new Error(`El producto ${product.nombre} no está disponible`);

            const cantidad = item.cantidad && item.cantidad > 0 ? item.cantidad : 1;
            const subtotal = product.precio * cantidad;
            totalCalculado += subtotal;

            itemsProcesados.push({
                producto: product._id,
                nombre: product.nombre,
                precioUnitario: product.precio,
                cantidad: cantidad
            });
        }

        const newOrder = {
            numeroMesa: orderData.numeroMesa,
            clienteNombre: orderData.clienteNombre || sessionUser.username,
            items: itemsProcesados,
            total: totalCalculado,
            atendidoPor: sessionUser.role === 'empleado' ? sessionUser.username : 'Cliente (Autoservicio)'
        };

        return await this.orderRepo.create(newOrder);
    }

    async getActiveOrders() {
        return await this.orderRepo.find({ estado: { $ne: 'pagado' } });
    }

    async getOrdersByMesa(numeroMesa) {
        return await this.orderRepo.find({ numeroMesa: numeroMesa, estado: { $ne: 'pagado' } });
    }

    async updateStatus(orderId, nuevoEstado) {
        const estadosValidos = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'pagado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            throw new Error('Estado no válido');
        }

        const order = await this.orderRepo.findById(orderId);
        if (!order) throw new Error('El pedido no existe');

        order.estado = nuevoEstado;
        return await order.save();
    }
    async deleteOrder(orderId) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) throw new Error('El pedido no existe');
        return await this.orderRepo.findByIdAndDelete(orderId);
    }
}