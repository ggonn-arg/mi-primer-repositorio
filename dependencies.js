import { addDependency } from './dependency.js';
import { UserService } from './services/user_service.js';
import { LoginService } from './services/login_service.js';
import { SessionService } from './services/session_service.js';
import { ProductService } from './services/product_service.js';
import { OrderService } from './services/order_service.js';

import UserMongo from './mongo-db/user_mongo.js';
import sessionMongo from './mongo-db/session_mongo.js';
import productMongo from './mongo-db/product_mongo.js';
import orderMongo from './mongo-db/order_mongo.js';

// Repositorios
addDependency('userRepo', UserMongo);
addDependency('sessionRepo', sessionMongo);
addDependency('productRepo', productMongo);
addDependency('orderRepo', orderMongo);

// Servicios
addDependency('userService', new UserService());
addDependency('sessionService', new SessionService());
addDependency('loginService', new LoginService());
addDependency('productService', new ProductService());
addDependency('orderService', new OrderService());