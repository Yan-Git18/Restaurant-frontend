import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Cliente } from '../../../model/cliente';
import { Usuario } from '../../../model/usuario';
import { ClienteService } from '../../../services/cliente-service';
import { UsuarioService } from '../../../services/usuario-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './cliente-dialog-component.html',
  styleUrls: ['./cliente-dialog-component.css'],
})
export class ClienteDialogComponent {
  form: FormGroup;
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: Cliente
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      telefono: [this.data?.telefono || '', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: [this.data?.direccion || '', [Validators.required, Validators.minLength(5)]],
      usuario: [this.data?.usuario || null, Validators.required],
    });

    this.usuarioService.findAll().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cliente: Cliente = { ...this.data, ...this.form.value };

    if (cliente.id > 0) {
      this.clienteService
        .update(cliente.id, cliente)
        .pipe(switchMap(() => this.clienteService.findAll()))
        .subscribe((data) => {
          this.clienteService.setClienteChange(data);
          this.clienteService.setMessageChange('CLIENTE ACTUALIZADO!');
          this.close(true);
        });
    } else {
      this.clienteService
        .save(cliente)
        .pipe(switchMap(() => this.clienteService.findAll()))
        .subscribe((data) => {
          this.clienteService.setClienteChange(data);
          this.clienteService.setMessageChange('CLIENTE CREADO!');
          this.close(true);
        });
    }
  }

  close(result = false) {
    this.dialogRef.close(result);
  }
}
