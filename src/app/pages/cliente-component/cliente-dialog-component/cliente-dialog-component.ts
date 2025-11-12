import { Component, Inject } from '@angular/core';
import { Cliente } from '../../../model/cliente';
import { Usuario } from '../../../model/usuario';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../services/cliente-service';
import { UsuarioService } from '../../../services/usuario-service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cliente-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './cliente-dialog-component.html',
  styleUrl: './cliente-dialog-component.css',
})
export class ClienteDialogComponent {
  cliente: Cliente;
  usuarios: Usuario[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Cliente,
    private _diajogRef: MatDialogRef<ClienteDialogComponent>,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cliente = this.data ? { ...this.data } : new Cliente();

    this.usuarioService.findAll().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  operate() {
    if (this.cliente != null && this.cliente.id > 0) {
      this.clienteService
        .update(this.cliente.id, this.cliente)
        .pipe(switchMap(() => this.clienteService.findAll()))
        .subscribe((data) => {
          this.clienteService.setClienteChange(data);
          this.clienteService.setMessageChange('CLIENTE UPDATED!');
        });

      this.close();
    } else {
      this.clienteService
        .save(this.cliente)
        .pipe(switchMap(() => this.clienteService.findAll()))
        .subscribe((data) => {
          this.clienteService.setClienteChange(data);
          this.clienteService.setMessageChange('CLIENTE CREATED!');
        });

      this.close();
    }
  }

  close() {
    this._diajogRef.close();
  }
}
