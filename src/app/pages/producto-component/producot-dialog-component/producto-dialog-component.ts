import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../services/producto-service';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-dialog-component',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './producto-dialog-component.html',
  styleUrl: './producto-dialog-component.css',
})
export class ProductoDialogComponent {
  producto: Producto;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Producto,
    private dialogRef: MatDialogRef<ProductoDialogComponent>,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.producto = this.data ? { ...this.data } : new Producto();
  }

  operate() {
    const request = this.producto.id
      ? this.productoService.update(this.producto.id, this.producto)
      : this.productoService.save(this.producto);

    request.pipe(switchMap(() => this.productoService.findAll()))
      .subscribe(data => {
        this.productoService.setProductoChange(data);
        this.productoService.setMessageChange(
          this.producto.id ? 'PRODUCTO ACTUALIZADO!' : 'PRODUCTO REGISTRADO!'
        );
        this.dialogRef.close();
      });
  }

  close() {
    this.dialogRef.close();
  }
}
