import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, toggleAttendance, updateEvent } from '../controllers/eventController.js';
import { requireAuth } from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const eventRouter = Router();
eventRouter.get('/', asyncHandler(listEvents));
eventRouter.get('/:id', asyncHandler(getEvent));
eventRouter.post('/', requireAuth, uploadImage.single('poster'), asyncHandler(createEvent));
eventRouter.patch('/:id', requireAuth, uploadImage.single('poster'), asyncHandler(updateEvent));
eventRouter.delete('/:id', requireAuth, asyncHandler(deleteEvent));
eventRouter.post('/:id/attendance', requireAuth, asyncHandler(toggleAttendance));

