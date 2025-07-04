import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import fs from 'fs';
import path from 'path';

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.find({
        where: { isDeleted: false },
        order: { createdAt: 'DESC' }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findOne({ 
        where: { id: parseInt(id), isDeleted: false }
      });
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { sku, name, price } = req.body;
      const files = req.files as Express.Multer.File[];
      
      // Generate image URLs
      const imageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
      
      const product = new Product();
      product.sku = sku;
      product.name = name;
      product.price = parseFloat(price);
      product.images = imageUrls;
      product.isDeleted = false;
      product.createdAt = new Date(); // Set creation timestamp
      
      const savedProduct = await this.productRepository.save(product);
      res.status(201).json(savedProduct);
    } catch (error: any) {
      // Clean up uploaded files if product creation fails
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }
      
      if (error.code === '23505') {
        res.status(400).json({ error: 'SKU already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create product' });
      }
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { sku, name, price, existingImages } = req.body;
      const files = req.files as Express.Multer.File[];
      
      const product = await this.productRepository.findOne({ 
        where: { id: parseInt(id), isDeleted: false }
      });
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      // Handle existing images
      let existingImageUrls: string[] = [];
      if (existingImages) {
        existingImageUrls = JSON.parse(existingImages);
      }
      
      // Handle new uploaded images
      const newImageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
      
      // Combine existing and new images
      const allImages = [...existingImageUrls, ...newImageUrls];
      
      // Delete old images that are not in the existing list
      const oldImages = product.images.filter(img => !existingImageUrls.includes(img));
      oldImages.forEach(imgUrl => {
        const filename = path.basename(imgUrl);
        const filepath = path.join(__dirname, '../../uploads', filename);
        fs.unlink(filepath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      });
      
      product.sku = sku;
      product.name = name;
      product.price = parseFloat(price);
      product.images = allImages;
      product.updatedAt = new Date(); // Update timestamp
      
      const updatedProduct = await this.productRepository.save(product);
      res.json(updatedProduct);
    } catch (error: any) {
      if (error.code === '23505') {
        res.status(400).json({ error: 'SKU already exists' });
      } else {
        res.status(500).json({ error: 'Failed to update product' });
      }
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findOne({ 
        where: { id: parseInt(id), isDeleted: false }
      });
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      // Soft delete
      product.isDeleted = true;
      await this.productRepository.save(product);
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  async hardDeleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findOne({ 
        where: { id: parseInt(id) }
      });
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      // Delete associated images from filesystem
      product.images.forEach(imgUrl => {
        const filename = path.basename(imgUrl);
        const filepath = path.join(__dirname, '../../uploads', filename);
        fs.unlink(filepath, (err) => {
          if (err) console.error('Error deleting image:', err);
        });
      });
      
      // Hard delete from database
      await this.productRepository.remove(product);
      
      res.json({ message: 'Product permanently deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to permanently delete product' });
    }
  }

  async restoreProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findOne({ 
        where: { id: parseInt(id), isDeleted: true }
      });
      
      if (!product) {
        res.status(404).json({ error: 'Deleted product not found' });
        return;
      }
      
      product.isDeleted = false;
      await this.productRepository.save(product);
      
      res.json({ message: 'Product restored successfully', product });
    } catch (error) {
      res.status(500).json({ error: 'Failed to restore product' });
    }
  }

  async getDeletedProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.find({
        where: { isDeleted: true },
        order: { updatedAt: 'DESC' }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deleted products' });
    }
  }
}