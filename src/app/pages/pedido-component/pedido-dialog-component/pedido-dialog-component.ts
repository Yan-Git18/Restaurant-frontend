import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { switchMap } from 'rxjs';
import { Pedido } from '../../../model/pedido';
import { PedidoService } from '../../../services/pedido-service';
import { ClienteService } from '../../../services/cliente-service';
import { MesaService } from '../../../services/mesa-service';
import { UsuarioService } from '../../../services/usuario-service';
import { Cliente } from '../../../model/cliente';
import { Mesa } from '../../../model/mesa';
import { Usuario } from '../../../model/usuario';

@Component({
  selector: 'app-pedido-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './pedido-dialog-component.html',
  styleUrl: './pedido-dialog-component.css',
})
export class PedidoDialogComponent {
  pedido: Pedido;
  fechaHoraLocal: string = '';
  clientes: Cliente[] = [];
  mesas: Mesa[] = [];
  usuarios: Usuario[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Pedido,
    private dialogRef: MatDialogRef<PedidoDialogComponent>,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private mesaService: MesaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.pedido = this.data ? { ...this.data } : new Pedido();

    // Establecer fecha local y estado inicial
    this.fechaHoraLocal = this.pedido.fecha
      ? this.convertToDatetimeLocal(this.pedido.fecha)
      : this.convertToDatetimeLocal(new Date());

    if (!this.pedido.estado) {
      this.pedido.estado = 'PENDIENTE';
    }

    // Cargar datos relacionados
    this.clienteService.findAll().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar clientes', err),
    });

    this.mesaService.findAll().subscribe({
      next: (data) => (this.mesas = data),
      error: (err) => console.error('Error al cargar mesas', err),
    });

    this.usuarioService.findAll().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  private convertToDatetimeLocal(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  save() {
    if (this.fechaHoraLocal) {
      this.pedido.fecha = new Date(this.fechaHoraLocal);
    }

    const request$ =
      this.pedido.idPedido && this.pedido.idPedido > 0
        ? this.pedidoService.update(this.pedido.idPedido, this.pedido)
        : this.pedidoService.save(this.pedido);

    request$
      .pipe(switchMap(() => this.pedidoService.findAll()))
      .subscribe({
        next: (data) => {
          this.pedidoService.setPedidoChange(data);
          const message =
            this.pedido.idPedido && this.pedido.idPedido > 0
              ? 'PEDIDO ACTUALIZADO!'
              : 'PEDIDO CREADO!';
          this.pedidoService.setMessageChange(message);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al guardar pedido', err);
          this.dialogRef.close(false);
        },
      });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  // Comparadores
  compareCliente(c1: Cliente, c2: Cliente): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareMesa(m1: Mesa, m2: Mesa): boolean {
    return m1 && m2 ? m1.id === m2.id : m1 === m2;
  }

  compareUsuario(u1: Usuario, u2: Usuario): boolean {
    return u1 && u2 ? u1.id === u2.id : u1 === u2;
  }
}