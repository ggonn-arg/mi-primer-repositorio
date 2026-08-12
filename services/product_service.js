import { getDependency } from '../dependency.js';

export class ProductService {
    constructor() {
        this.productRepo = getDependency('productRepo');
    }

    async getList() {
        return await this.productRepo.find({ disponible: true });
    }

    async getAll() {
        return await this.productRepo.find();
    }

    async add(productData) {
        if (!productData.nombre) throw new Error('El nombre del producto es obligatorio');
        if (!productData.precio || productData.precio <= 0) throw new Error('El precio debe ser un número mayor a 0');
        if (!productData.categoria) throw new Error('La categoría es obligatoria');

        return await this.productRepo.create(productData);
    }

    async update(id, productData) {
        const product = await this.productRepo.findById(id);
        if (!product) throw new Error('El producto no existe');

        return await this.productRepo.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        const product = await this.productRepo.findById(id);
        if (!product) throw new Error('El producto no existe');

        await this.productRepo.findByIdAndDelete(id);
    }
}