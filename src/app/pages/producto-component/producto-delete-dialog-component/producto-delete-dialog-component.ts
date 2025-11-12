import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../services/producto-service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-producto-delete-dialog-component',
  standalone: true,
  imports: [CommonModule, MaterialModule],
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
    this.productoService.delete(this.data.id).subscribe(() => {
      this.productoService.findAll().subscribe((data) => {
        this.productoService.setProductoChange(data);
        this.productoService.setMessageChange('PRODUCTO ELIMINADO!');
        this.dialogRef.close(true);
      });
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}