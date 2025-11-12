import { Component, ViewChild } from '@angular/core';
import { Pedido} from '../../model/pedido';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '../../material/material-module';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoService } from '../../services/pedido-service';
import { ReservaDialogComponent } from '../reserva-component/reserva-dialog-component/reserva-dialog-component';
import { PedidoDeleteDialogComponent } from './pedido-delete-dialog-component/pedido-delete-dialog-component';

@Component({
  selector: 'app-pedido-component',
  imports: [
    MaterialModule, DatePipe
  ],
  templateUrl: './pedido-component.html',
  styleUrl: './pedido-component.css',
})
export class PedidoComponent {
   dataSource: MatTableDataSource<Pedido>;
   columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'cliente', label: 'Cliente', hide: false },
    { def: 'mesa', label: 'Mesa', hide: false },
    { def: 'fechaHora', label: 'Fecha y Hora', hide: false },
    { def: 'total', label: 'Total', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private pedidoService: PedidoService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('📦 Intentando cargar reservas desde backend...');

    this.pedidoService.findAll().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos desde backend:', data);
        this.createTable(data);
      },
      error: (err) => {
        console.error('❌ Error al obtener reservas:', err);
      },
    });
  }

  createTable(data: Pedido[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
   getDisplayedColumns() {
      return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
    }
  
    applyFilter(e: any) {
      this.dataSource.filter = e.target.value.trim();
    }
  
    openDialog(pedido?: Pedido) {
      this._dialog.open(ReservaDialogComponent, {
        width: '750px',
        data: pedido,
      });
    }
  
  openDeleteDialog(pedido: Pedido) {
      const dialogRef = this._dialog.open(PedidoDeleteDialogComponent, {
        width: '400px',
        data: pedido,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._snackBar.open('pedido eliminado correctamente', 'Cerrar', {
            duration: 3000,
          });
        }
      });
  }
}