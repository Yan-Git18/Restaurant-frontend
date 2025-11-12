import { Component, Inject } from '@angular/core';
import { Rol } from '../../../model/rol';
import { RolService } from '../../../services/rol-service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-rol-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './rol-delete-dialog-component.html',
  styleUrl: './rol-delete-dialog-component.css',
})
export class RolDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Rol,
    private dialogRef: MatDialogRef<RolDeleteDialogComponent>,
    private rolService: RolService
  ) {}

  confirmDelete() {
    this.rolService.delete(this.data.id).subscribe({
      next: () => {
        this.rolService.findAll().subscribe((data) => {
          this.rolService.setRolChange(data);
          this.rolService.setMessageChange('ROL ELIMINADO!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar usuario', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
