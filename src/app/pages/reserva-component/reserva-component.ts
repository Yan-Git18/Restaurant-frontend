import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Reserva } from '../../model/reserva';
import { ReservaService } from '../../services/reserva-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { DatePipe } from '@angular/common';
import { ReservaDialogComponent } from './reserva-dialog-component/reserva-dialog-component';
import { ReservaDeleteDialogComponent } from './reserva-delete-dialog-component/reserva-delete-dialog-component';

@Component({
  selector: 'app-reserva-component',
  imports: [MaterialModule, DatePipe],
  templateUrl: './reserva-component.html',
  styleUrl: './reserva-component.css',
})
export class ReservaComponent {
  dataSource: MatTableDataSource<Reserva>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'cliente', label: 'Cliente', hide: false },
    { def: 'mesa', label: 'Mesa', hide: false },
    { def: 'fechaHora', label: 'Fecha y Hora', hide: false },
    { def: 'numeroPersonas', label: 'Personas', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private reservaService: ReservaService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('📦 Intentando cargar reservas desde backend...');

    this.reservaService.findAll().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos desde backend:', data);
        this.createTable(data);
      },
      error: (err) => {
        console.error('❌ Error al obtener reservas:', err);
      },
    });
  }

  createTable(data: Reserva[]) {
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

  openDialog(reserva?: Reserva) {
    this._dialog.open(ReservaDialogComponent, {
      width: '750px',
      data: reserva,
    });
  }

  openDeleteDialog(reserva: Reserva) {
    const dialogRef = this._dialog.open(ReservaDeleteDialogComponent, {
      width: '400px',
      data: reserva,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBar.open('Reserva eliminada correctamente', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
