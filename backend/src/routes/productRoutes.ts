import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { upload } from '../config/multer';

const router = Router();
const productController = new ProductController();

// Regular product routes
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProduct.bind(productController));
router.post('/', upload.array('images', 5), productController.createProduct.bind(productController));
router.put('/:id', upload.array('images', 5), productController.updateProduct.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));

// Soft delete management routes
router.get('/deleted/all', productController.getDeletedProducts.bind(productController));
router.patch('/:id/restore', productController.restoreProduct.bind(productController));
router.delete('/:id/permanent', productController.hardDeleteProduct.bind(productController));

export default router;