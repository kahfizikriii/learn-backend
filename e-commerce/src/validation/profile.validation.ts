import { body, param } from 'express-validator';

export const createProfileValidation = [
  body('name').notEmpty().withMessage('Name wajib diisi'),
  body('gender').isIn(['male','female','other']).withMessage('Gender harus valid'),
  body('address').notEmpty().withMessage('Address wajib diisi'),
  body('userId').isInt().withMessage('User ID harus valid')
];

export const updateProfileValidation = [
  param('id').isInt().withMessage('Profile ID tidak valid'),
  body('name').optional().notEmpty(),
  body('gender').optional().isIn(['male','female','other']),
  body('address').optional().notEmpty()
];