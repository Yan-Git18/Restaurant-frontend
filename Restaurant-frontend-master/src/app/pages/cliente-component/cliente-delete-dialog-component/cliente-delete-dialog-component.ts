import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente-service';

@Component({
  selector: 'app-cliente-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cliente-delete-dialog-component.html',
  styleUrl: './cliente-delete-dialog-component.css',
})
export class ClienteDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private dialogRef: MatDialogRef<ClienteDeleteDialogComponent>,
    private clienteService: ClienteService
  ) {}

  confirmDelete() {
    console.log('Eliminando cliente:', this.data);

    this.clienteService.delete(this.data.id).subscribe({
      next: () => {
        this.clienteService.findAll().subscribe((clientes) => {
          this.clienteService.setClienteChange(clientes);
          this.clienteService.setMessageChange('CLIENTE ELIMINADO!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar cliente:', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
