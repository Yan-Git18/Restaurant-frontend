import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comprobante } from '../../../model/comprobante';
import { ComprobanteService } from '../../../services/comprobante-service';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comprobante-dialog-component',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './comprobante-dialog-component.html',
  styleUrl: './comprobante-dialog-component.css',
})
export class ComprobanteDialogComponent {
  comprobante: Comprobante;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Comprobante,
    private dialogRef: MatDialogRef<ComprobanteDialogComponent>,
    private comprobanteService: ComprobanteService
  ) {}

  ngOnInit(): void {
    this.comprobante = this.data ? { ...this.data } : new Comprobante();
  }

  operate() {
    const request = this.comprobante.id
      ? this.comprobanteService.update(this.comprobante.id, this.comprobante)
      : this.comprobanteService.save(this.comprobante);

    request.pipe(switchMap(() => this.comprobanteService.findAll()))
      .subscribe(data => {
        this.comprobanteService.setComprobanteChange(data);
        this.comprobanteService.setMessageChange(
          this.comprobante.id ? 'COMPROBANTE ACTUALIZADO!' : 'COMPROBANTE REGISTRADO!'
        );
        this.dialogRef.close();
      });
  }

  close() {
    this.dialogRef.close();
  }
}