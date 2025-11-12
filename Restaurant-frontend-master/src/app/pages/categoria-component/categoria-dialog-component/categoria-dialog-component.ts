import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../../model/categoria';
import { CategoriaService } from '../../../services/categoria-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-categoria-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './categoria-dialog-component.html',
  styleUrl: './categoria-dialog-component.css',
})
export class CategoriaDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoriaDialogComponent>,
    private categoriaService: CategoriaService,
    @Inject(MAT_DIALOG_DATA) public data: Categoria
  ) {
    this.form = this.fb.group({
      id: [data?.id],
      nombre: [data?.nombre || '', [Validators.required, Validators.minLength(3)]],
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const categoria: Categoria = this.form.value;

    const op = categoria.id
      ? this.categoriaService.update(categoria.id, categoria)
      : this.categoriaService.save(categoria);

    op.pipe(switchMap(() => this.categoriaService.findAll())).subscribe({
      next: data => {
        this.categoriaService.setCategoriaChange(data);
        this.dialogRef.close();
      },
      error: err => console.error('Error al guardar categoría', err)
    });
  }

  close() {
    this.dialogRef.close();
  }
}
