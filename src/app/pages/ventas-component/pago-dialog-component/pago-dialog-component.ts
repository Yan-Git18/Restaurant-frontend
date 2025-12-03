import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { PagoDTO, PagoService } from '../../../services/pago-service';

@Component({
  selector: 'app-pago-dialog',
  templateUrl: './pago-dialog-component.html',
  styleUrls: ['./pago-dialog-component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
})
export class PagoDialogComponent {
  form: FormGroup;
  venta: any;

  metodosPago: string[] = [
    'EFECTIVO',
    'YAPE',
    'PLIN',
    'VISA',
    'MASTERCARD',
    'AMERICAN_EXPRESS',
    'TRANSFERENCIA',
    'DEPOSITO',
    'PAYPAL'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PagoDialogComponent>,
    private fb: FormBuilder,
    private pagoService: PagoService,
    private snackBar: MatSnackBar
  ) {
    this.venta = data.venta;
    this.form = this.fb.group({
      metodo: ['EFECTIVO', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  registrar() {
    if (this.form.invalid) return;

    const dto: PagoDTO = {
      metodo: this.form.value.metodo,
      monto: this.form.value.monto,
      ventaId: this.venta.id,
    };

    this.pagoService.registrarPago(dto).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          'Error al registrar pago: ' + (err?.error?.message || err.message),
          'Cerrar',
          { duration: 3500 }
        );
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
