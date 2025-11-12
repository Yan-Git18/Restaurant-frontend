import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../model/reserva';
import { ReservaService } from '../../../services/reserva-service';

@Component({
  selector: 'app-reserva-delete-dialog-component',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './reserva-delete-dialog-component.html',
  styleUrl: './reserva-delete-dialog-component.css',
})
export class ReservaDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Reserva,
    private dialogRef: MatDialogRef<ReservaDeleteDialogComponent>,
    private reservaService: ReservaService
  ) {}

  confirmDelete() {
    this.reservaService.delete(this.data.id).subscribe({
      next: () => {
        this.reservaService.findAll().subscribe((data) => {
          this.reservaService.setReservaChange(data);
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
