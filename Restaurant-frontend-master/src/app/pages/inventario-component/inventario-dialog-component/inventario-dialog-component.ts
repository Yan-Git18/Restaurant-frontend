import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material-module';
import { Inventario } from '../../../model/inventario';

@Component({
  selector: 'app-inventario-dialog-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './inventario-dialog-component.html',
  styleUrls: ['./inventario-dialog-component.css'],
})
export class InventarioDialogComponent implements OnInit {
  inventario: Inventario;
  esEdicion: boolean = false; 
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InventarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Inventario
  ) {
    this.inventario = data ? { ...data } : new Inventario();
    this.esEdicion = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.inventario.nombre || '', [Validators.required, Validators.minLength(3)]],
      stockTotal: [this.inventario.stockTotal || 0, [Validators.required, Validators.min(0)]],
      unidadMedida: [this.inventario.unidadMedida || '', Validators.required],
      minimoStock: [this.inventario.minimoStock || 0, [Validators.required, Validators.min(0)]],
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const inventarioActualizado: Inventario = { ...this.inventario, ...this.form.value };
    this.dialogRef.close(inventarioActualizado);
  }

  close() {
    this.dialogRef.close();
  }
}
