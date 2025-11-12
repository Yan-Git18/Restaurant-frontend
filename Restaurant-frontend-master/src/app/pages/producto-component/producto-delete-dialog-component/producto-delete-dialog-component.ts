import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../services/producto-service';

@Component({
  selector: 'app-producto-delete-dialog-component',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './producto-delete-dialog-component.html',
  styleUrl: './producto-delete-dialog-component.css',
})
export class ProductoDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private dialogRef: MatDialogRef<ProductoDeleteDialogComponent>,
    private productoService: ProductoService
  ) {}

  confirmDelete() {
    this.productoService.delete(this.data.id).subscribe({
      next: () => {
        this.productoService.findAll().subscribe((data) => {
          this.productoService.setProductoChange(data);
          this.productoService.setMessageChange('PRODUCTO ELIMINADO!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar producto', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}