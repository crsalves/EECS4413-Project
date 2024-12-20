/**
 * This file centralizes all route imports and exports them for easier integration into the main application.
 *
 * @file index.ts
 * @author Carla da Silva Alves
 */

import { Router } from 'express';
import { categoryRouter } from './categoryRoute';
import { productRouter } from './productRoute';
import { userRouter } from './userRoute';
import { authRouter } from './authRoute';
import { orderRouter } from './orderRoute';
import { wishlistRouter } from './wishlistRoute';
import { reviewRouter } from './reviewRoute';
import { paymentRouter } from './paymentRoute';

export const router = Router();

// Path to the routes
router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/order', orderRouter);
router.use('/wishlist', wishlistRouter);
router.use('/review', reviewRouter);
router.use('/payment', paymentRouter);
