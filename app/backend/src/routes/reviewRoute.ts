/**
 *	Handles GET, POST, PUT, DELETE requests.
 *
 *	@file reviewRoute.ts
 *	@author Carla da Silva Alves
 */
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ReviewController } from '../controllers/reviewController';

export const reviewRouter = Router();
const reviewController = new ReviewController(); 

/**
 * GET retrieves data from the database.
 */
reviewRouter.get(
	'/',asyncHandler(async (req: Request, res: Response) => {
		const reviews = await reviewController.getReviews();
		if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found in the database.' });
        }
		return res.status(200).json({ message: 'Reviews retrieved successfully.', data: reviews });
	})
);

/**
 * GET retrieves data from the database by ID.
 */
reviewRouter.get(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		return;
	})
);

/**
 * POST adds data into the database.
 */
reviewRouter.post(
	'/',
	asyncHandler(async (req: Request, res: Response) => {
		return;
	})
);

/**
 * PUT updates data in the database by ID.
 */
reviewRouter.put(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		return;
	})
);

/**
 * DELETE removes a data from the database by ID.
 */
reviewRouter.delete(
	'/:id',
	asyncHandler(async (req: Request, res: Response) => {
		return;
	})
);
