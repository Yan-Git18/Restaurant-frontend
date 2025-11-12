import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Rol } from '../../model/rol';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RolService } from '../../services/rol-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from './rol-dialog-component/rol-dialog-component';
import { RolDeleteDialogComponent } from './rol-delete-dialog-component/rol-delete-dialog-component';

@Component({
  selector: 'app-rol',
  imports: [MaterialModule],
  templateUrl: './rol-component.html',
  styleUrl: './rol-component.css',
})
export class RolComponent {
  dataSource: MatTableDataSource<Rol>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: true },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private rolService: RolService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('Intentando cargar roles desde backend...');

    this.rolService.findAll().subscribe({
      next: (data) => {
        console.log('Datos recibidos desde backend:', data);
        this.createTable(data);
      },
      error: (err) => {
        console.error('Error al obtener roles:', err);
      },
    });

    this.rolService.getRolChange().subscribe((data) => {
      this.createTable(data);
    });

    this.rolService.getMessageChange().subscribe((msg) => {
      this._snackBar.open(msg, 'Cerrar', {
        duration: 3000,
      });
    });
  }

  createTable(data: Rol[]) {
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

  openDialog(rol?: Rol) {
    this._dialog.open(RolDialogComponent, {
      width: '750px',
      data: rol,
    });
  }

  openDeleteDialog(rol: Rol) {
    const dialogRef = this._dialog.open(RolDeleteDialogComponent, {
      width: '400px',
      data: rol,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBar.open('Rol eliminado correctamente', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
