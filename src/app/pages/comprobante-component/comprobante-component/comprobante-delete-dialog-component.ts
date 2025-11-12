import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comprobante } from '../../../model/comprobante';
import { ComprobanteService } from '../../../services/comprobante-service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-comprobante-delete-dialog-component',
  standalone: true,
  imports: [CommonModule, MaterialModule],
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
    this.comprobanteService.delete(this.data.id).subscribe(() => {
      this.comprobanteService.findAll().subscribe((data) => {
        this.comprobanteService.setComprobanteChange(data);
        this.comprobanteService.setMessageChange('COMPROBANTE ELIMINADO!');
        this.dialogRef.close(true);
      });
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}