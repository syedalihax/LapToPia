import { Router } from 'express';
import {
	createBrand,
	createCategory,
	deleteBrand,
	deleteCategory,
	getBrands,
	getCategories,
	updateBrand,
	updateCategory,
} from '../controllers/categoryController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';
import imageUpload from '../middlewares/imageUploadMiddleware.js';
import { uploadCategoryImage } from '../controllers/imageController.js';

const router = Router();

router.get('/', getCategories);
router.get('/brands', getBrands);
router.post('/images', protect, authorize('admin'), imageUpload.single('image'), uploadCategoryImage);
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);
router.post('/brands', protect, authorize('admin'), createBrand);
router.put('/brands/:id', protect, authorize('admin'), updateBrand);
router.delete('/brands/:id', protect, authorize('admin'), deleteBrand);

export default router;
