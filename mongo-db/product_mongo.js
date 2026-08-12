import mongoose from 'mongoose';

export default mongoose.model('products', new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    categoria: { type: String, enum: ['bebida', 'comida', 'postre'], required: true },
    disponible: { type: Boolean, default: true }
}));