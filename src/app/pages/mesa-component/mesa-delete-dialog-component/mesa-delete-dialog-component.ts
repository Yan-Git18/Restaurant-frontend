import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Mesa } from '../../../model/mesa';
import { MesaService } from '../../../services/mesa-service';

@Component({
  selector: 'app-mesa-delete-dialog-component',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './mesa-delete-dialog-component.html',
  styleUrl: './mesa-delete-dialog-component.css',
})
export class MesaDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Mesa,
    private dialogRef: MatDialogRef<MesaDeleteDialogComponent>,
    private mesaService: MesaService
  ) {}

  confirmDelete() {
    this.mesaService.delete(this.data.id).subscribe({
      next: () => {
        this.mesaService.findAll().subscribe((data) => {
          this.mesaService.setMesaChange(data);
          this.mesaService.setMessageChange('MESA ELIMINADA!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar mesa', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
