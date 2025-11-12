import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario-service';

@Component({
  selector: 'app-usuario-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './usuario-delete-dialog-component.html',
  styleUrl: './usuario-delete-dialog-component.css',
})
export class UsuarioDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private dialogRef: MatDialogRef<UsuarioDeleteDialogComponent>,
    private usuarioService: UsuarioService
  ) {}

  confirmDelete() {
    this.usuarioService.delete(this.data.id).subscribe({
      next: () => {
        this.usuarioService.findAll().subscribe((data) => {
          this.usuarioService.setUsuarioChange(data);
          this.usuarioService.setMessageChange('USUARIO ELIMINADO!');
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
