import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { Brand, Category, Discount, EnabledDisabled, Product, ProductImage } from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { Confirmation } from './confirmation';
import { PrimeNG } from 'primeng/config';

export interface TableHeader {
  label: string;
  width: string;
}
@Injectable({
  providedIn: 'root',

})
export class ProductService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  confirmation = inject(Confirmation);
  formBuilder = inject(FormBuilder);
  config = inject(PrimeNG);

  enumPageSize = [5, 10, 15];
  loading = true;

  headers: TableHeader[] = [
    { label: 'Código', width: '15%' },
    { label: 'Nombre', width: '20%' },
    { label: 'Descripción', width: '25%' },
    { label: 'Marca', width: '10%' },
    { label: 'Categoría', width: '10%' },
    { label: 'Peso_kg', width: '5%' },
    { label: 'Precio', width: '5%' },
    { label: 'Descuento', width: '5%' },
    { label: 'Precio Final', width: '5%' },
    { label: 'Stock', width: '5%' },
    { label: 'Habilitado', width: '5%' },
    { label: 'Opciones', width: '5%' },
  ];
  // components
  table: Table | null = null;
  fu: FileUpload | null = null;
  fileUploader: FileUpload | null = null;

  products: Product[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByCodeOrName: string | null = null;
  enabled: EnabledDisabled[] = EnabledDisabled;
  selectedEnabled: EnabledDisabled | null = null;
  discount: Discount[] = Discount;
  selectedDiscount: Discount | null = null;
  categorysAll: Category[] = [];
  selectedCategory: Category | null = null;
  brandsAll: Brand[] = [];
  selectedBrand: Brand | null = null;

  categorysEnabled: Category[] = [];
  brandsEnabled: Brand[] = [];

  selectedProduct: Product | null = null;
  visibleModal: boolean = false;

  constructor() {
    this.getProducts();
    this.http
      .get(this.API_URL + 'category/findAll', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.categorysAll = res as Category[];
      });
    this.http
      .get(this.API_URL + 'category/findAllEnabled', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.categorysEnabled = res as Category[];
      });
    this.http
      .get(this.API_URL + 'brand/findAll', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.brandsAll = res as Brand[];
      });
      this.http
      .get(this.API_URL + 'brand/findAllEnabled', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.brandsEnabled = res as Brand[];
      });
  }

  form = this.formBuilder.group({
    name: [
      null as string | null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
    ],
    description: [null as string | null, [Validators.minLength(3), Validators.maxLength(1000)]],

    price: [null as number | null, [Validators.required, Validators.min(0)]],
    discount: [null as number | null, [Validators.min(1), Validators.max(100)]],
    weight_kg: [null as number | null, [Validators.required, Validators.min(0)]],
    id_category: [null as Category | null, [Validators.required]],
    id_brand: [null as Brand | null, [Validators.required]],
  });
  setComponents(value: { table: Table; fu: FileUpload; fileUploader: FileUpload }) {
    this.table = value.table;
    this.fu = value.fu;
    this.fileUploader = value.fileUploader;
  }
  setFileUploader(fileUploader:FileUpload){
    this.fileUploader=fileUploader
  }

  search() {
    this.page = 1;
    if (this.table) {
      this.table.first = 0;
    }
    this.getProducts();
  }

  updateProduct(product: Product) {
    this.resetForm();
    this.selectedProduct = product;

    this.form.patchValue({
      name: product.nombre,
      description: product.descripcion,
      price: product.precio,
      discount: product.porcentaje_descuento,
      weight_kg: product.peso_kg,
      id_category: product.categoria,
      id_brand: product.marca,
    });
    this.toogleDialog();
  }
  toogleDialog() {
    this.visibleModal = !this.visibleModal;
  }
  showDialog() {
    this.resetForm();
    this.toogleDialog();
  }

  resetForm() {
    this.selectedProduct = null;
    this.form.reset();
  }

  getProducts() {
    this.loading = true;
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByCodeOrName && { searchByCodeOrName: this.searchByCodeOrName }),
      ...(this.selectedEnabled && { enabled: this.selectedEnabled.value }),
      ...(this.selectedDiscount && { discount: this.selectedDiscount.value }),
      ...(this.selectedCategory && { id_category: this.selectedCategory.id }),
      ...(this.selectedBrand && { id_brand: this.selectedBrand.id }),
    };
    this.http
      .post(this.API_URL + 'product/findByAdminWithStock', body, { withCredentials: true })
      .subscribe({
        next: (res) => {
          const [products, count] = res as [Product[], number];
          this.products = products;
          this.count = count;
        },
        error: (res) => {},
        complete: () => {
          this.loading = false;
        },
      });
  }
  lazyLoad(event: TableLazyLoadEvent) {
    this.pageSize = event.rows ?? 5;
    this.page = Math.floor((event.first ?? 0) / this.pageSize) + 1;
    this.getProducts();
  }
  resetFilters() {
    this.searchByCodeOrName = null;
    this.selectedEnabled = null;
    this.selectedDiscount = null;
    this.selectedCategory = null;
    this.selectedBrand = null;
  }
  operationProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: any = this.form.value;
    body.id_category = body.id_category?.id;
    body.id_brand = body.id_brand?.id;

    const selectedProduct: Product | null = this.selectedProduct ? this.selectedProduct : null;

    const request = selectedProduct
      ? this.http.patch(this.API_URL + 'product/update/' + selectedProduct.id, body, {
          withCredentials: true,
        })
      : this.http.post(this.API_URL + 'product/create', body, {
          withCredentials: true,
        });

    request.subscribe({
      next: () => {
        this.getProducts();
      },
      error: (error) => {
        const message = selectedProduct ? 'Actualizar' : 'Crear';
        const errorMessage = error.error.message || 'Hubo un error inesperado';

        this.message.error({
          summary: `Error al ${message} producto`,
          detail: `Hubo un problema: ${errorMessage}`,
        });
      },
      complete: () => {
        const message = selectedProduct ? 'actualizado' : 'creado';
        this.message.success({
          summary: `Producto ${message}`,
          detail: `El producto ha sido ${message} correctamente.`,
        });
      },
    });
    this.showDialog();
  }

  enabledDisabled(product: Product) {
    const enabled: boolean = !product.habilitado;
    const text = enabled ? 'Habilitado' : 'Deshabilitado';
    const text2 = enabled ? 'Habilitar' : 'Deshabilitar';
    const severity = enabled ? 'success' : 'info';

    this.http
      .patch(
        this.API_URL + 'product/enabledDisabled/' + product.id,
        { enabled },
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          this.getProducts();
        },
        error: () => {
          this.message.error({
            summary: `Error al ${text2} producto`,
            detail: `Hubo un problema: al intentar ${text2} el producto`,
          });
        },
        complete: () => {
          this.message.add({
            severity,
            summary: `Producto: ${product.nombre}`,
            detail: `El Producto ha sido ${text} correctamente.`,
          });
        },
      });
  }

  // CRUD IMAGENES
  files: File[] = [];
  maxFileSize = 1000 * 1000 * 0.2;
  maxFiles: number = 4;
  productReferenceImg?: Product | null;
  spinner: boolean = false;

  selectedProductImage: ProductImage | null = null;
  visibleModalImage: boolean = false;
  formImage = this.formBuilder.group({
    file: [null as File | null, Validators.required],
  });
  viewImages(product: Product) {
    this.productReferenceImg = product;
    this.getImages();
  }

  getImages() {
    if (!this.productReferenceImg)
      return this.message.warn({
        summary: 'Producto no seleccionado',
        detail: 'No se ha seleccionado un producto para asociar las imágenes.',
      });
    this.spinner = true;
    const product = this.productReferenceImg;
    this.http
      .get(this.API_URL + 'product-image/findByProduct/' + product.id, { withCredentials: true })
      .subscribe({
        next: (productImage) => {
          if (this.fileUploader) {
            this.fileUploader.clear();
            this.files = [];
            this.fileUploader.uploadedFiles = [...(productImage as File[])];
          }
        },
        error: () => {
          this.message.error({
            summary: 'Error al ver imagen',
            detail: `No se puede visualizar las imagenes del producto: ${product.nombre}`,
          });
        },
        complete: () => {
          this.spinner = false;
        },
      });
  }
  // del update de imagen
  onSelectImage(event: any) {
    const file = event.files[0];
    const fileControl = this.formImage.get('file');
    fileControl?.setValue(file);
    fileControl?.markAsDirty();
    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }
  onRemoveImage(event: FileRemoveEvent) {
    const fileControl = this.formImage.get('file');
    fileControl?.setValue(null);
    fileControl?.setValidators([Validators.required]);
    fileControl?.updateValueAndValidity();
  }
  toogleDialogImage() {
    this.visibleModalImage = !this.visibleModalImage;
  }
  showDialogImage() {
    this.resetFormImage();
    this.toogleDialogImage();
  }
  resetFormImage() {
    if (this.fu) {
      this.fu.clear();
    }
    const fileControl = this.formImage.get('file');
    fileControl?.setValue(null);
    fileControl?.setValidators([Validators.required]);
    fileControl?.updateValueAndValidity();
    this.formImage.reset();
  }
  updateImage(product_image: ProductImage) {
    this.resetFormImage();
    this.selectedProductImage = product_image;
    console.log(this.selectedProductImage);
    
    this.toogleDialogImage();
  }
  operationUpdateImage() {
    if (this.formImage.invalid) {
      this.formImage.markAllAsTouched();
      return;
    }
    this.spinner = true;
    const formData = new FormData();
    const value = this.formImage.value;

    if (value.file) {
      formData.append('file', value.file);
    }
    const selectedProductImage: ProductImage | null = this.selectedProductImage
      ? this.selectedProductImage
      : null;
    const id = selectedProductImage?.id;

    this.http
      .patch(this.API_URL + 'product-image/update/' + id, formData, { withCredentials: true })
      .subscribe({
        next: () => {
          this.getImages();
        },
        error: (error) => {
          this.message.error({
            summary: 'Error al actualizar imagen',
            detail: `Hubo un problema al actualizar la imagen: ${selectedProductImage?.secure_url}`,
          });
        },
        complete: () => {
          this.message.info({
            summary: 'Imagen actualizada',
            detail: 'La imagen ha sido actualizada correctamente.',
          });
        },
      });
    this.showDialogImage();
  }
  // termina update de image

  async deleteImage(event: Event, product_image: ProductImage) {
    const isConfirmed = await this.confirmation.confirm({
      header: 'Eliminar imagen',
      message: '¿Estas seguro de eliminar la imagen?',
      position: 'right',
      target: event.currentTarget as HTMLElement,
    });

    if (!isConfirmed)
      return this.message.info({
        summary: 'Acción cancelada',
      });
    this.spinner = true;

    this.http
      .delete(this.API_URL + 'product-image/delete/' + product_image.id, { withCredentials: true })
      .subscribe({
        next: () => {
          this.getImages();
        },
        error: (error) => {
          this.message.error({
            summary: 'Error al eliminar imagen',
            detail: `Hubo un problema al eliminar la imagen: ${error.message}`,
          });
        },
        complete: () => {
          this.message.info({
            summary: 'Imagen eliminada',
            detail: 'La imagen ha sido eliminada correctamente.',
          });
        },
      });
  }

  choose(event: any, callback: () => void) {
    callback();
  }

  onRemoveTemplatingFile(
    event: any,
    file: File,
    removeFileCallback: (arg0: any, arg1: any) => void,
    index: number
  ) {
    removeFileCallback(event, index);

    this.fileUploader ? (this.files = [...this.fileUploader.files]) : null;
    this.message.info({
      summary: 'Imagen removida',
      detail: 'La imagen en memoria ha sido removida con exito.',
    });
  }

  onClearTemplatingUpload(clear: () => void) {
    clear();

    this.files = [];
    this.message.info({
      summary: 'Imagenes removidas.',
      detail: 'Todas las imagenes en memoria han sido removidas.',
    });
  }

  onSelectedFiles(event: { files: File[]; currentFiles: File[] }) {
    
    const remainingSlots = this.maxFiles - this.showProgressBar()[1];

    if (remainingSlots <= 0) {
      this.message.error({
        summary: 'Límite de imágenes',
        detail: `Máximo permitido: ${this.maxFiles} imágenes.`,
      });
      this.fileUploader ? (this.fileUploader.files = [...this.files]) : null;
      return;
    }

    const selectedFiles = event.currentFiles;

    // FILTRAR SOLO ARCHIVOS NUEVOS
    const newFiles = selectedFiles.filter(
      (file) =>
        !this.files.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        )
    );

    let invalidFiles = 0;
    const validFiles = newFiles.filter((file) =>
      file.size <= this.maxFileSize ? true : (invalidFiles++, false)
    );

    if (invalidFiles > 0) {
      this.message.error({
        summary: 'Archivo demasiado grande',
        detail: `Máximo tamaño permitido: ${(this.maxFileSize / (1024 * 1024)).toFixed(2)} MB.`,
      });
    }

    if (validFiles.length > remainingSlots) {
      this.message.warn({
        summary: 'Algunas imágenes no se agregaron',
        detail: `Solo se permiten ${remainingSlots} imágenes más.`,
      });
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);

    // Actualiza la lista de archivos
    this.files = [...this.files, ...filesToAdd];

    this.fileUploader ? (this.fileUploader.files = [...this.files]) : null;
  }

  showProgressBar(): number[] {
    const value = this.fileUploader ? this.fileUploader?.uploadedFiles?.length : 0;
    // Aquí recalculamos el progreso de manera correcta
    const totalFiles = this.files.length + value; // Archivos en caché + nube
    const progress = (totalFiles / this.maxFiles) * 100;

    // Asegúrate de que el progreso no sea mayor que 100%
    const progressValue = Math.min(progress, 100);

    // Actualizar el valor de la barra de progreso
    return [progressValue, totalFiles]; // Aquí se debe actualizar la propiedad que se está utilizando en el HTML
  }

  uploadImages() {
    if (!this.productReferenceImg) {
      this.message.error({
        summary: 'Producto no seleccionado',
        detail: 'No se ha seleccionado un producto para asociar las imágenes.',
      });
      return;
    }

    if (this.files.length === 0) {
      this.message.warn({
        summary: 'Sin archivos',
        detail: 'No hay imágenes para subir.',
      });
      return;
    }
    this.spinner = true;
    const formData = new FormData();

    this.files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    const product = this.productReferenceImg;

    this.http.post(`${this.API_URL}product-image/create/${product.id}`, formData,{
      withCredentials:true
    }).subscribe({
      next: () => {
        this.getImages();
      },
      error: (error) => {
        this.message.error({
          summary: 'Error al subir imágenes',
          detail: 'Hubo un problema al subir las imágenes.',
        });
      },
      complete: () => {
        this.message.success({
          summary: 'Subida exitosa de imágenes',
          detail: `Las imágenes de ${product.nombre} se han subido correctamente.`,
        });
      },
    });
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes || [];
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
  clearCallbackMio() {
    this.files = [];
    this.fileUploader ? (this.fileUploader.files = []) : null;
    this.message.info({
      summary: 'Imagenes removidas.',
      detail: 'Todas las imagenes en memoria han sido removidas.',
    });
  }
}
