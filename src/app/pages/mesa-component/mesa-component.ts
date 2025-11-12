import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mesa } from '../../model/mesa';
import { MesaService } from '../../services/mesa-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { MesaDialogComponent } from './mesa-dialog-component/mesa-dialog-component';
import { MesaDeleteDialogComponent } from './mesa-delete-dialog-component/mesa-delete-dialog-component';

@Component({
  selector: 'app-mesa-component',
  imports: [MaterialModule],
  templateUrl: './mesa-component.html',
  styleUrl: './mesa-component.css',
})
export class MesaComponent {
  dataSource: MatTableDataSource<Mesa>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'numero', label: 'Número', hide: false },
    { def: 'ubicacion', label: 'Ubicación', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private mesaService: MesaService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('📦 Intentando cargar mesas desde backend...');

    this.mesaService.findAll().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos desde backend:', data);
        this.createTable(data);
      },
      error: (err) => {
        console.error('❌ Error al obtener mesas:', err);
      },
    });
  }

  createTable(data: Mesa[]) {
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

  openDialog(mesa?: Mesa) {
    this._dialog.open(MesaDialogComponent, {
      width: '750px',
      data: mesa,
    });
  }

  openDeleteDialog(mesa: Mesa) {
    const dialogRef = this._dialog.open(MesaDeleteDialogComponent, {
      width: '400px',
      data: mesa,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBar.open('Mesa eliminada correctamente', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
