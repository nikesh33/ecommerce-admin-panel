import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product";
import fs from "fs";
import path from "path";

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productRepository.find({
        where: { isDeleted: false },
        order: { createdAt: "DESC" },
      });
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await this.productRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const { sku, name, price } = req.body;
      const files = req.files as Express.Multer.File[];
      const imageUrls = files?.map((f) => (f as any).path as string) || [];

      const product = this.productRepository.create({
        sku,
        name,
        price: parseFloat(price),
        images: imageUrls,
        isDeleted: false,
        createdAt: new Date(),
      });

      const saved = await this.productRepository.save(product);
      res.status(201).json(saved);
    } catch (err: any) {
      console.error(err);
      if (err.code === "23505") {
        res.status(400).json({ error: "SKU already exists" });
      } else {
        res.status(500).json({ error: "Failed to create product" });
      }
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { sku, name, price, existingImages } = req.body;
      const files = req.files as Express.Multer.File[];

      const product = await this.productRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!product) return res.status(404).json({ error: "Product not found" });

      let oldList: string[] = [];
      try {
        oldList = existingImages ? JSON.parse(existingImages) : [];
      } catch (parseError) {
        console.error("Invalid existingImages format:", existingImages);
        return res.status(400).json({ error: "Invalid existingImages format" });
      }

      const newUrls = files?.map((f) => (f as any).path as string) || [];

      product.images = [...oldList, ...newUrls];
      product.sku = sku;
      product.name = name;
      product.price = parseFloat(price);
      product.updatedAt = new Date();

      const updated = await this.productRepository.save(product);
      res.json(updated);
    } catch (err: any) {
      console.error("[Product Update Error]", err);
      if (err.code === "23505") {
        res.status(400).json({ error: "SKU already exists" });
      } else {
        res.status(500).json({ error: "Failed to update product" });
      }
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await this.productRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!product) return res.status(404).json({ error: "Product not found" });

      product.isDeleted = true;
      await this.productRepository.save(product);
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }

  async hardDeleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) return res.status(404).json({ error: "Product not found" });

      product.images.forEach((imgUrl: string) => {
        const filename = path.basename(imgUrl);
        const filepath = path.join(__dirname, "../../uploads", filename);
        fs.unlink(filepath, (err) => {
          if (err) console.error(err);
        });
      });

      await this.productRepository.remove(product);
      res.json({ message: "Product permanently deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to permanently delete product" });
    }
  }

  async restoreProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await this.productRepository.findOne({
        where: { id, isDeleted: true },
      });
      if (!product)
        return res.status(404).json({ error: "Deleted product not found" });

      product.isDeleted = false;
      await this.productRepository.save(product);
      res.json({ message: "Product restored successfully", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to restore product" });
    }
  }

  async getDeletedProducts(req: Request, res: Response) {
    try {
      const products = await this.productRepository.find({
        where: { isDeleted: true },
        order: { updatedAt: "DESC" },
      });
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch deleted products" });
    }
  }
}
