import { configureUserRouter } from "./infraestructura/user_router.js";

export function configureRouter(router) {
    console.log('Configurando router');
    configureUserRouter(router);
}