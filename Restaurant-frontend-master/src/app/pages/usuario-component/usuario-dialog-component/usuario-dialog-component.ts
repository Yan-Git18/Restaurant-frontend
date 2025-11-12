import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario-service';
import { RolService } from '../../../services/rol-service';
import { Rol } from '../../../model/rol';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './usuario-dialog-component.html',
  styleUrls: ['./usuario-dialog-component.css']
})
export class UsuarioDialogComponent {

  form: FormGroup;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id],
      nombre: [this.data?.nombre || '', [Validators.required, Validators.minLength(3)]],
      correo: [this.data?.correo || '', [Validators.required, Validators.email]],
      contrasena: [this.data?.contrasena || '', [Validators.required, Validators.minLength(6)]],
      rol: [this.data?.rol || null, Validators.required],
    });

    this.rolService.findAll().subscribe({
      next: (r) => (this.roles = r),
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuario: Usuario = this.form.value;

    const operacion = usuario.id
      ? this.usuarioService.update(usuario.id, usuario)
      : this.usuarioService.save(usuario);

    operacion.pipe(
      switchMap(() => this.usuarioService.findAll())
    ).subscribe({
      next: (data) => {
        this.usuarioService.setUsuarioChange(data);
        this.usuarioService.setMessageChange(
          usuario.id ? 'Usuario editado correctamente' : 'Usuario creado correctamente'
        );
        this.dialogRef.close(usuario.id ? 'edit' : 'create');
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
