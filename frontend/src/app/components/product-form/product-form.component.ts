import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  error = '';
  
  selectedFiles: File[] = [];
  existingImages: string[] = [];
  previewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getProduct(this.productId!).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          sku: product.sku,
          name: product.name,
          price: product.price
        });
        
        this.existingImages = [...product.images];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load product';
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      this.previewUrls = [];
      
      // Generate preview URLs
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrls.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      
      const formData = new FormData();
      formData.append('sku', this.productForm.value.sku);
      formData.append('name', this.productForm.value.name);
      formData.append('price', this.productForm.value.price.toString());
      
      if (this.isEditMode) {
        formData.append('existingImages', JSON.stringify(this.existingImages));
      }
      
      // Append new image files
      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const operation = this.isEditMode 
        ? this.productService.updateProduct(this.productId!, formData)
        : this.productService.createProduct(formData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.error = error.error?.error || 'Failed to save product';
          this.loading = false;
        }
      });
    }
  }
}