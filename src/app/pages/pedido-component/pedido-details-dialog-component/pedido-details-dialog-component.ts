import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-pedido-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './pedido-details-dialog-component.html',
})
export class PedidoDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PedidoDetailsDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }

  getTotal() {
    if (!this.data?.detalles) return 0;
    return this.data.detalles.reduce((s, d) => s + (d.subtotal || (d.cantidad * d.producto?.precio || 0)), 0);
  }
}