import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load product';
        this.loading = false;
      },
    });
  }

  deleteProduct(): void {
    if (
      this.product &&
      confirm('Are you sure you want to delete this product?')
    ) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.error = 'Failed to delete product';
        },
      });
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    return `https://ecommerce-admin-panel-pcgk.onrender.com${imagePath}`;
  }
  nextImage(): void {
    if (this.product && this.product.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage(): void {
    if (this.product && this.product.images.length > 0) {
      this.currentImageIndex =
        this.currentImageIndex === 0
          ? this.product.images.length - 1
          : this.currentImageIndex - 1;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }
}
