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
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './mesa-component.html',
  styleUrls: ['./mesa-component.css'],
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private mesaService: MesaService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();

    this.mesaService.getMesaChange().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => console.error('Error en mesaChange', err),
    });
  }

  private loadAll() {
    this.mesaService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => {
        this._snackBar.open('Error al cargar mesas', 'Cerrar', { duration: 3000 });
      },
    });
  }

  createTable(data: Mesa[]) {
    this.dataSource = new MatTableDataSource(data || []);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.filterPredicate = (data: Mesa, filter: string) => {
      const f = filter.trim().toLowerCase();
      const texto = `${data.id} ${data.numero} ${data.ubicacion} ${data.estado}`.toLowerCase();
      return texto.includes(f);
    };
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  openDialog(mesa?: Mesa) {
    const dialogRef = this._dialog.open(MesaDialogComponent, {
      width: '750px',
      data: mesa,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'create') {
        this._snackBar.open('Mesa creada correctamente', 'Cerrar', { duration: 2500 });
      } else if (result === 'edit') {
        this._snackBar.open('Mesa editada correctamente', 'Cerrar', { duration: 2500 });
      }

      if (result) {
        this.mesaService.findAll().subscribe({
          next: (data) => this.createTable(data),
          error: (err) => console.error('Error al recargar mesas', err),
        });
      }
    });
  }

  openDeleteDialog(mesa: Mesa) {
    const dialogRef = this._dialog.open(MesaDeleteDialogComponent, {
      width: '400px',
      data: mesa,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.mesaService.findAll().subscribe({
          next: (data) => {
            this.createTable(data);
            this._snackBar.open('Mesa eliminada correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => console.error('Error al recargar mesas tras eliminación', err),
        });
      }
    });
  }
}
