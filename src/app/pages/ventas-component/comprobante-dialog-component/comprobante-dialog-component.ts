import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ComprobanteService } from '../../../services/comprobante-service';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-comprobante-dialog',
  templateUrl: './comprobante-dialog-component.html',
  styleUrls: ['./comprobante-dialog-component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule]
})
export class ComprobanteDialogComponent {
  form: FormGroup;
  venta: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ComprobanteDialogComponent>,
    private fb: FormBuilder,
    private comprobanteService: ComprobanteService,
    private snackBar: MatSnackBar
  ) {
    this.venta = data.venta;
    this.form = this.fb.group({
      tipo: ['Boleta', Validators.required],
      formato: ['Físico', Validators.required],
      numero: ['', Validators.required]
    });

    const suggested = `T-${this.venta?.id || '000'}-${Date.now().toString().slice(-4)}`;
    this.form.controls['numero'].setValue(suggested);
  }

  saveComprobante() {
    if (this.form.invalid) return;

    const dto: any = {
      tipo: this.form.value.tipo,
      formato: this.form.value.formato,
      numero: this.form.value.numero,
      venta: {
        id: this.venta.id,
        pedidoId: this.venta.pedidoId,
        clienteId: this.venta.clienteId,
        total: this.venta.total,
        fecha: this.venta.fecha
      }
    };

    this.comprobanteService.save(dto).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error creando comprobante: ' + (err?.error?.message || err.message || ''), 'Cerrar', { duration: 3500 });
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
