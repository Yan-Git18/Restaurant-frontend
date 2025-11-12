import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../services/producto-service';
import { CategoriaService } from '../../../services/categoria-service';
import { InventarioService } from '../../../services/inventario-service';
import { Categoria } from '../../../model/categoria';
import { Inventario } from '../../../model/inventario';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
],
  templateUrl: './producto-dialog-component.html',
  styleUrls: ['./producto-dialog-component.css']
})
export class ProductoDialogComponent {
  producto: Producto = new Producto();
  categorias: Categoria[] = [];
  inventarios: Inventario[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Producto,
    private _dialogRef: MatDialogRef<ProductoDialogComponent>,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    if (this.data) this.producto = { ...this.data };

    this.categoriaService.findAll().subscribe(data => (this.categorias = data));
    this.inventarioService.findAll().subscribe(data => (this.inventarios = data));
  }

operate() {
  const op = this.producto.id
    ? this.productoService.update(this.producto.id, this.producto)
    : this.productoService.save(this.producto);

  op.pipe(switchMap(() => this.productoService.findAll()))
    .subscribe(data => {
      this.productoService.setProductoChange(data);
      this.productoService.setMessageChange(
        this.producto.id ? 'Producto editado correctamente' : 'Producto creado correctamente'
      );
      this._dialogRef.close(this.producto.id ? 'edit' : 'create'); 
    });
}

  close() {
    this._dialogRef.close();
  }

  compareCategoria(c1: Categoria, c2: Categoria): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareInventario(i1: Inventario, i2: Inventario): boolean {
    return i1 && i2 ? i1.id === i2.id : i1 === i2;
  }
}