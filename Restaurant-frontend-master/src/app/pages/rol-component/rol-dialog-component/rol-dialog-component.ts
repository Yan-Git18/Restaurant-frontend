import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../model/rol';
import { RolService } from '../../../services/rol-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-rol-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './rol-dialog-component.html',
  styleUrl: './rol-dialog-component.css',
})
export class RolDialogComponent {
  form: FormGroup;
  rol: Rol;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RolDialogComponent>,
    private rolService: RolService,
    @Inject(MAT_DIALOG_DATA) public data: Rol
  ) {
    this.rol = data || new Rol(); 
    this.form = this.fb.group({
      nombre: [this.rol.nombre, [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id],
      nombre: [this.data?.nombre || '', [Validators.required, Validators.minLength(3)]],
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rol: Rol = this.form.value;

    if (rol.id > 0) {
      this.rolService.update(rol.id, rol)
        .pipe(switchMap(() => this.rolService.findAll()))
        .subscribe(data => {
          this.rolService.setRolChange(data);
          this.rolService.setMessageChange('ROL ACTUALIZADO!');
          this.dialogRef.close();
        });
    } else {
      this.rolService.save(rol)
        .pipe(switchMap(() => this.rolService.findAll()))
        .subscribe(data => {
          this.rolService.setRolChange(data);
          this.rolService.setMessageChange('ROL CREADO!');
          this.dialogRef.close();
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
