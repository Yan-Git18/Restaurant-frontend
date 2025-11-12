import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from '../../model/pedido';
import { PedidoService } from '../../services/pedido-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PedidoDialogComponent } from './pedido-dialog-component/pedido-dialog-component';
import { PedidoDeleteDialogComponent } from './pedido-delete-dialog-component/pedido-delete-dialog-component';
import { MaterialModule } from '../../material/material-module';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido-component',
  standalone: true,
  imports: [CommonModule, MaterialModule, DatePipe],
  templateUrl: './pedido-component.html',
  styleUrls: ['./pedido-component.css'],
})
export class PedidoComponent {
  dataSource: MatTableDataSource<Pedido>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: true },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'fecha', label: 'Fecha', hide: false },
    { def: 'cliente', label: 'Cliente', hide: false },
    { def: 'mesa', label: 'Mesa', hide: false },
    { def: 'usuario', label: 'Usuario', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pedidoService: PedidoService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.pedidoService.getPedidoChange().subscribe((data) => this.createTable(data));
    this.pedidoService.getMessageChange().subscribe((msg) => {
      if (msg) this._snackBar.open(msg, 'Cerrar', { duration: 3000 });
    });
  }

  private loadAll() {
    this.pedidoService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this._snackBar.open('Error al cargar pedidos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  createTable(data: Pedido[]) {
    this.dataSource = new MatTableDataSource(data || []);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.filterPredicate = (data: Pedido, filter: string) => {
      const f = filter.trim().toLowerCase();
      const cliente = data.cliente?.usuario?.nombre ?? '';
      const mesa = data.mesa?.numero ?? '';
      const usuario = data.usuario?.nombre ?? '';
      const texto = `${data.id} ${data.estado} ${data.fecha} ${cliente} ${mesa} ${usuario}`.toLowerCase();
      return texto.includes(f);
    };
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // Abrir el dialog en modo CREAR (sin pedido)
  openDialog(pedido?: Pedido) {
    const dialogRef = this._dialog.open(PedidoDialogComponent, {
      width: '800px',
      data: { pedido: pedido ?? null, soloLectura: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadAll();
    });
  }

  openDeleteDialog(pedido: Pedido) {
    const dialogRef = this._dialog.open(PedidoDeleteDialogComponent, {
      width: '400px',
      data: pedido,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadAll();
    });
  }

  // Ver detalle en modo SOLO LECTURA
  verDetalle(pedido: Pedido) {
    this._dialog.open(PedidoDialogComponent, {
      width: '800px',
      data: { pedido, soloLectura: true }
    });
  }
}