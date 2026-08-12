import mongoose from 'mongoose';

export default mongoose.model('orders', new mongoose.Schema({
    numeroMesa: { type: Number, required: true },
    clienteNombre: { type: String, required: true },
    items: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            nombre: { type: String, required: true },
            precioUnitario: { type: Number, required: true },
            cantidad: { type: Number, required: true, default: 1 }
        }
    ],
    total: { type: Number, required: true },
    estado: { 
        type: String, 
        enum: ['pendiente', 'en_preparacion', 'listo', 'entregado', 'pagado'], 
        default: 'pendiente' 
    },
    atendidoPor: { type: String, default: 'Cliente (Autoservicio)' },
    fecha: { type: Date, default: Date.now }
}));