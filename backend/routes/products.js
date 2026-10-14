import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js';
import { uploadProductImages } from '../controllers/imageController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';
import imageUpload from '../middlewares/imageUploadMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.post('/images', protect, authorize('admin'), imageUpload.array('images', 5), uploadProductImages);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
