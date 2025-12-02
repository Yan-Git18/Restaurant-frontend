import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from '../../../model/categoria';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../services/producto-service';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    CommonModule
  ],
  templateUrl: './producto-dialog-component.html',
  styleUrl: './producto-dialog-component.css'
})
export class ProductoDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductoDialogComponent>,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: { producto: Producto; categorias: Categoria[] }
  ) {

    const p = data.producto;

    this.form = this.fb.group({
      id: [p?.id],
      nombre: [p?.nombre || '', Validators.required],
      descripcion: [p?.descripcion || ''],
      precio: [p?.precio || '', [Validators.required, Validators.min(0.1)]],
      stockActual: [p?.stockActual || 0, [Validators.required, Validators.min(0)]],

      // 🔥 FIX: Cargar correctamente categoriaId desde backend
      categoriaId: [p?.categoriaId || null, Validators.required],
    });

  }

  operate() {
    if (this.form.invalid) return;

    const dto = this.form.value;

    const op = dto.id
      ? this.productoService.update(dto.id, dto)
      : this.productoService.save(dto);

    op.pipe(switchMap(() => this.productoService.findAll()))
      .subscribe(data => {
        this.productoService.setProductoChange(data);
        this.dialogRef.close();
      });
  }

  close() {
    this.dialogRef.close();
  }
}