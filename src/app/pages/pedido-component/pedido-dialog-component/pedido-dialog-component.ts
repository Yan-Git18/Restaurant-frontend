import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Producto } from '../../../model/producto';
import { Cliente } from '../../../model/cliente';
import { Mesa } from '../../../model/mesa';
import { Usuario } from '../../../model/usuario';
import { PedidoDTO } from '../../../services/pedido-service';

import { ProductoService } from '../../../services/producto-service';
import { ClienteService } from '../../../services/cliente-service';
import { MesaService } from '../../../services/mesa-service';
import { UsuarioService } from '../../../services/usuario-service';
import { PedidoService } from '../../../services/pedido-service';

@Component({
  selector: 'app-pedido-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDialogActions
],
  templateUrl: './pedido-dialog-component.html',
  styleUrls: ['./pedido-dialog-component.css'],
})
export class PedidoDialogComponent implements OnInit {
  form: FormGroup;

  productos: Producto[] = [];
  clientes: Cliente[] = [];
  mesas: Mesa[] = [];
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private mesaService: MesaService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private dialogRef: MatDialogRef<PedidoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      mesaId: [null, Validators.required],
      usuarioId: [null, Validators.required],
      clienteId: [null],
      detalles: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadData();
    this.addDetalle();
  }

  loadData() {
    this.productoService.findAll().subscribe((data) => (this.productos = data));

    this.clienteService.findAll().subscribe((data) => {
      this.clientes = data.filter((c) =>
        c.usuario?.roles?.some((r) => r.nombre === 'CLIENTE')
      );
    });

    this.mesaService.findAll().subscribe((data) => (this.mesas = data));

    this.usuarioService.findAll().subscribe((data) => {
      this.usuarios = data.filter((u) =>
        u.roles?.some((r) => r.nombre === 'MESERO')
      );
    });
  }

  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  addDetalle() {
    this.detalles.push(
      this.fb.group({
        productoId: [null, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeDetalle(idx: number) {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(idx);
    }
  }

  getSubtotal(i: number): number {
    const det = this.detalles.at(i).value;
    const prod = this.productos.find((p) => p.id === det.productoId);
    return prod ? prod.precio * det.cantidad : 0;
  }

  getTotal(): number {
    return this.detalles.controls.reduce(
      (sum, _, i) => sum + this.getSubtotal(i),
      0
    );
  }

  save() {
    if (this.form.invalid || this.getTotal() === 0) return;

    const dto: PedidoDTO = {
      clienteId: this.form.value.clienteId || null,
      mesaId: this.form.value.mesaId,
      usuarioId: this.form.value.usuarioId,
      detalles: this.form.value.detalles,
    };

    this.pedidoService.registrarPedido(dto).subscribe({
      next: () => this.dialogRef.close('created'),
      error: (err) => console.error(err),
    });
  }

  close() {
    this.dialogRef.close();
  }
}