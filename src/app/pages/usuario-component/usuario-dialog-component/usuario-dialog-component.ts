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
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    MatIconModule,
  ],
  templateUrl: './usuario-dialog-component.html',
  styleUrls: ['./usuario-dialog-component.css'],
})
export class UsuarioDialogComponent {
  form!: FormGroup;
  roles: Rol[] = [];
  selectedRoleIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    @Inject(MAT_DIALOG_DATA) public data?: Usuario
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id || null],
      nombre: [this.data?.nombre || '', [Validators.required, Validators.minLength(3)]],
      correo: [this.data?.correo || '', [Validators.required, Validators.email]],
      contrasena: [
        '',
        this.data?.id ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)],
      ],
    });

    this.rolService.findAll().subscribe({
      next: (r) => {
        this.roles = r;
        if (this.data?.roles) {
          this.selectedRoleIds = this.data.roles.map((rr) => rr.id);
        }
      },
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const usuarioToSend: any = {
      id: formValue.id,
      nombre: formValue.nombre,
      correo: formValue.correo,
      roles: this.selectedRoleIds.map((id) => ({ id } as Rol)),
    };

    if (formValue.contrasena && formValue.contrasena.trim().length > 0) {
      usuarioToSend.contrasena = formValue.contrasena;
    }

    const operacion = usuarioToSend.id
      ? this.usuarioService.update(usuarioToSend.id, usuarioToSend)
      : this.usuarioService.save(usuarioToSend);

    operacion.pipe(switchMap(() => this.usuarioService.findAll())).subscribe({
      next: (data) => {
        this.usuarioService.setUsuarioChange(data);
        this.usuarioService.setMessageChange(
          usuarioToSend.id ? 'Usuario editado correctamente' : 'Usuario creado correctamente'
        );
        this.dialogRef.close(usuarioToSend.id ? 'edit' : 'create');
      },
      error: (err) => {
        console.error('Error operacion usuario', err);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
