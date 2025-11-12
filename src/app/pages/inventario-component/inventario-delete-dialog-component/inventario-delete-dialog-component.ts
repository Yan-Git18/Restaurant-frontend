import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Inventario } from '../../../model/inventario';
import { InventarioService } from '../../../services/inventario-service';

@Component({
  selector: 'app-inventario-delete-dialog-component',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './inventario-delete-dialog-component.html',
  styleUrl: './inventario-delete-dialog-component.css',
})
export class InventarioDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Inventario,
    private dialogRef: MatDialogRef<InventarioDeleteDialogComponent>,
    private inventarioService: InventarioService
  ) {}

  confirmDelete() {
    this.inventarioService.delete(this.data.id).subscribe({
      next: () => {
        this.inventarioService.findAll().subscribe((data) => {
          this.inventarioService.setInventarioChange(data);
          this.inventarioService.setMessageChange('INVENTARIO ELIMINADO!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar inventario', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}