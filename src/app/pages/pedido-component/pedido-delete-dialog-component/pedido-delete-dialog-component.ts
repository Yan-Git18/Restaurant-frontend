import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PedidoService } from '../../../services/pedido-service';
import { Pedido } from '../../../model/pedido';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pedido-delete-dialog-component',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './pedido-delete-dialog-component.html',
  styleUrl: './pedido-delete-dialog-component.css',
})
export class PedidoDeleteDialogComponent {
 constructor(
    @Inject(MAT_DIALOG_DATA) public data: Pedido,
    private dialogRef: MatDialogRef<PedidoDeleteDialogComponent>,
    private reservaService: PedidoService
  ) {}

  confirmDelete() {
    this.reservaService.delete(this.data.idPedido).subscribe({
      next: () => {
        this.reservaService.findAll().subscribe((data) => {
          this.reservaService.setPedidoChange(data);
          this.reservaService.setMessageChange('RESERVA ELIMINADA!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar reserva', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
