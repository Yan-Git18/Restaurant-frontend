import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Comprobante } from '../../../model/comprobante';
import { ComprobanteService } from '../../../services/comprobante-service';

@Component({
  selector: 'app-comprobante-delete-dialog',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './comprobante-delete-dialog-component.html',
  styleUrl: './comprobante-delete-dialog-component.css',
})
export class ComprobanteDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Comprobante,
    private dialogRef: MatDialogRef<ComprobanteDeleteDialogComponent>,
    private comprobanteService: ComprobanteService
  ) {}

  confirmDelete() {
    this.comprobanteService.delete(this.data.id).subscribe({
      next: () => {
        this.comprobanteService.findAll().subscribe((data) => {
          this.comprobanteService.setComprobanteChange(data);
          this.comprobanteService.setMessageChange('COMPROBANTE ELIMINADO!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar comprobante', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}