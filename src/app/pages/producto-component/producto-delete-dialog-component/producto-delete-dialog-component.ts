import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '../../../services/producto-service';
import { Producto } from '../../../model/producto';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-producto-delete',
  templateUrl: './producto-delete-dialog-component.html',
  imports: [MaterialModule],
})
export class ProductoDeleteDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private dialogRef: MatDialogRef<ProductoDeleteDialogComponent>,
    private productoService: ProductoService
  ) {}

  confirmDelete() {
    this.productoService.delete(this.data.id).subscribe(() => {
      this.productoService.findAll().subscribe(list => {
        this.productoService.setProductoChange(list);
        this.dialogRef.close(true);
      });
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}