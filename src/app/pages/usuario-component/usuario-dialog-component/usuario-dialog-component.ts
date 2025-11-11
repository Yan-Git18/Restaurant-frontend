import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Rol } from '../../../model/rol';
import { RolService } from '../../../services/rol-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,],
  templateUrl: './usuario-dialog-component.html',
  styleUrl: './usuario-dialog-component.css',
})
export class UsuarioDialogComponent {
  usuario: Usuario;
  roles: Rol[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private _diajogRef: MatDialogRef<UsuarioDialogComponent>,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}  

  ngOnInit(): void {
    this.usuario = this.data ? { ...this.data } : new Usuario();

    // 🔽 Cargar roles desde el backend
    this.rolService.findAll().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error al cargar roles', err),
    });
  }

  operate() {
    if (this.usuario != null && this.usuario.id > 0) {
      this.usuarioService
        .update(this.usuario.id, this.usuario)
        .pipe(switchMap(() => this.usuarioService.findAll()))
        .subscribe((data) => {
          this.usuarioService.setUsuarioChange(data);
          this.usuarioService.setMessageChange('SUPPLIER UPDATED!');
        });

        this.close();
    } else {
      this.usuarioService
        .save(this.usuario)
        .pipe(switchMap(() => this.usuarioService.findAll()))
        .subscribe((data) => {
          this.usuarioService.setUsuarioChange(data);
          this.usuarioService.setMessageChange('SUPPLIER CREATED!');
        });

        this.close();
    }
  }

  close() {
    this._diajogRef.close();
  }
}
