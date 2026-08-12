import { configureUserRouter } from './user_router.js';
import { configureLoginRouter } from './login_router.js';
import { configureProductRouter } from './product_router.js';
import { configureOrderRouter } from './order_router.js';

export function configureRouter(router) {
    console.log('Configurando rutas..');
    configureUserRouter(router);
    configureLoginRouter(router);
    configureProductRouter(router);
    configureOrderRouter(router);
}