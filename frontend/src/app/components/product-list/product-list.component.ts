import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  deletedProducts: Product[] = [];
  loading = false;
  error = '';
  showDeleted = false;

  itemsPerPage: number = 6;
  currentPage: number = 1;

  // Modal Confirmation State
  confirmation = {
    show: false,
    productId: 0 || null,
    action: '',
    message: '',
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  toggleView(): void {
    this.showDeleted = !this.showDeleted;
    this.error = '';
    if (this.showDeleted) {
      this.loadDeletedProducts();
    } else {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      },
    });
  }

  loadDeletedProducts(): void {
    this.loading = true;
    this.productService.getDeletedProducts().subscribe({
      next: (products) => {
        this.deletedProducts = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load deleted products';
        this.loading = false;
      },
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  get paginatedDeletedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.deletedProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    const total = this.showDeleted
      ? this.deletedProducts.length
      : this.products.length;
    return Math.ceil(total / this.itemsPerPage);
  }

  // Modal trigger handlers
  openConfirmation(id: number, action: string): void {
    let message = '';
    switch (action) {
      case 'delete':
        message = 'Are you sure you want to delete this product?';
        break;
      case 'restore':
        message = 'Are you sure you want to restore this product?';
        break;
      case 'deleteForever':
        message =
          'Are you sure you want to permanently delete this product? This action cannot be undone!';
        break;
    }

    this.confirmation = {
      show: true,
      productId: id,
      action,
      message,
    };
  }

  handleConfirm(): void {
    const { productId, action } = this.confirmation;
    this.confirmation.show = false;

    if (action === 'delete') {
      this.productService.deleteProduct(productId).subscribe({
        next: () => this.loadProducts(),
        error: () => (this.error = 'Failed to delete product'),
      });
    } else if (action === 'restore') {
      this.productService.restoreProduct(productId).subscribe({
        next: () => this.loadDeletedProducts(),
        error: () => (this.error = 'Failed to restore product'),
      });
    } else if (action === 'deleteForever') {
      this.productService.permanentlyDeleteProduct(productId).subscribe({
        next: () => this.loadDeletedProducts(),
        error: () => (this.error = 'Failed to permanently delete product'),
      });
    }
  }

  handleCancel(): void {
    this.confirmation.show = false;
  }

  getImageUrl(imagePath: string): string {
    return imagePath;
  }
}
