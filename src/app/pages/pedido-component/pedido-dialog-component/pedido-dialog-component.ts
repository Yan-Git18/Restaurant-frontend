import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from '../../../model/pedido';
import { PedidoService } from '../../../services/pedido-service';
import { ClienteService } from '../../../services/cliente-service';
import { UsuarioService } from '../../../services/usuario-service';
import { MesaService } from '../../../services/mesa-service';
import { ProductoService } from '../../../services/producto-service';
import { DetallePedido } from '../../../model/detallePedido';
import { switchMap } from 'rxjs';
import { Cliente } from '../../../model/cliente';
import { Usuario } from '../../../model/usuario';
import { Mesa } from '../../../model/mesa';
import { Producto } from '../../../model/producto';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pedido-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatDialogContent,
  ],
  templateUrl: './pedido-dialog-component.html',
  styleUrls: ['./pedido-dialog-component.css'],
})
export class PedidoDialogComponent {
  pedido: Pedido;
  form!: FormGroup;

  clientes: Cliente[] = [];
  meseros: Usuario[] = [];
  mesas: Mesa[] = [];
  productos: Producto[] = [];
  estados: string[] = ['PENDIENTE', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO'];

  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 1;

  dataSourceDetalles = new MatTableDataSource<DetallePedido>();
  columns = ['producto', 'cantidad', 'subtotal', 'acciones'];

  soloLectura = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<PedidoDialogComponent>,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private mesaService: MesaService,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const incoming = this.data ?? {};
    this.soloLectura = !!incoming.soloLectura;

    if (incoming.pedido && incoming.pedido.id) {
      this.pedidoService.findById(incoming.pedido.id).subscribe({
        next: (p) => {
          this.pedido = p;
          if (!this.pedido.detalles) this.pedido.detalles = [];
          this.dataSourceDetalles.data = this.pedido.detalles;
          this.buildForm();
        },
        error: (err) => {
          console.error('Error al cargar pedido completo', err);
          this.pedido = incoming.pedido;
          this.dataSourceDetalles.data = this.pedido.detalles || [];
          this.buildForm();
        },
      });
    } else {
      this.pedido = incoming.pedido ?? new Pedido();
      if (!this.pedido.fecha) this.pedido.fecha = new Date();
      if (!this.pedido.estado) this.pedido.estado = 'PENDIENTE';
      if (!this.pedido.detalles) this.pedido.detalles = [];
      this.dataSourceDetalles.data = this.pedido.detalles;
      this.buildForm();
    }

    this.clienteService.findAll().subscribe((clients) => {
      //this.clientes = clients.filter((c) => c.usuario?.rol?.nombre?.toUpperCase() === 'CLIENTE');
    });
    this.usuarioService.findAll().subscribe((users) => {
      //this.meseros = users.filter((u) => u.rol?.nombre?.toUpperCase() === 'MESERO');
    });
    this.mesaService.findAll().subscribe((data) => (this.mesas = data));
    this.productoService.findAll().subscribe((data) => (this.productos = data));
  }

  buildForm() {
    this.form = this.fb.group({
      cliente: [this.pedido.cliente || null, Validators.required],
      usuario: [this.pedido.usuario || null, Validators.required],
      mesa: [this.pedido.mesa || null, Validators.required],
      estado: [this.pedido.estado || 'PENDIENTE', Validators.required],
      fecha: [this.pedido.fecha ? this.fechaFormateada : '', Validators.required],
    });
  }

  get fechaFormateada(): string {
    if (!this.pedido || !this.pedido.fecha) return '';
    const d = new Date(this.pedido.fecha);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }

  onFechaChange(value: string) {
    if (!value) return;
    this.pedido.fecha = new Date(value);
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidadSeleccionada <= 0) return;

    const detalle = new DetallePedido();
    //detalle.producto = this.productoSeleccionado;
    detalle.cantidad = this.cantidadSeleccionada;
    detalle.subtotal = this.cantidadSeleccionada * (this.productoSeleccionado.precio ?? 0);

    this.pedido.detalles.push(detalle);
    this.dataSourceDetalles.data = [...this.pedido.detalles];

    this.productoSeleccionado = null;
    this.cantidadSeleccionada = 1;
  }

  removeDetalle(detalle: DetallePedido) {
    this.pedido.detalles = this.pedido.detalles.filter((d) => d !== detalle);
    this.dataSourceDetalles.data = [...this.pedido.detalles];
  }

  calcularTotal(): number {
    return (this.pedido.detalles || []).reduce((acc, d) => acc + (d.subtotal ?? 0), 0);
  }

  save() {
    if (this.soloLectura) return this._dialogRef.close();
    if (this.form.invalid || this.pedido.detalles.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.pedido.cliente = this.form.value.cliente;
    this.pedido.usuario = this.form.value.usuario;
    this.pedido.mesa = this.form.value.mesa;
    this.pedido.estado = this.form.value.estado;
    this.pedido.fecha = new Date(this.form.value.fecha);

    const operation = this.pedido.id
      ? this.pedidoService.update(this.pedido.id, this.pedido)
      : this.pedidoService.save(this.pedido);

    operation.pipe(switchMap(() => this.pedidoService.findAll())).subscribe({
      next: (data) => {
        this.pedidoService.setPedidoChange(data);
        this.pedidoService.setMessageChange(
          this.pedido.id ? 'PEDIDO ACTUALIZADO!' : 'PEDIDO CREADO!'
        );
        this._dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al guardar pedido', err);
      },
    });
  }

  close() {
    this._dialogRef.close();
  }
}
