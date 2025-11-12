import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pedido } from '../../../model/pedido';
import { PedidoService } from '../../../services/pedido-service';
import { MaterialModule } from '../../../material/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedido-delete-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './pedido-delete-dialog-component.html',
  styleUrls: ['./pedido-delete-dialog-component.css']
})
export class PedidoDeleteDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Pedido,
    private _dialogRef: MatDialogRef<PedidoDeleteDialogComponent>,
    private pedidoService: PedidoService
  ) {}

  confirmarEliminacion() {
    if (!this.data?.id) return;

    this.pedidoService.delete(this.data.id).subscribe({
      next: () => {
        this.pedidoService.findAll().subscribe((data) => {
          this.pedidoService.setPedidoChange(data);
          this.pedidoService.setMessageChange('Pedido eliminado correctamente.');
          this._dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('Error al eliminar pedido', err);
        this._dialogRef.close(false);
      }
    });
  }

  cancelar() {
    this._dialogRef.close(false);
  }
}