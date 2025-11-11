import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from './usuario-dialog-component/usuario-dialog-component';
import { MaterialModule } from '../../material/material-module';
import { UsuarioDeleteDialogComponent } from './usuario-delete-dialog-component/usuario-delete-dialog-component';

@Component({
  selector: 'app-usuario',
  imports: [MaterialModule],
  templateUrl: './usuario-component.html',
  styleUrl: './usuario-component.css',
})
export class UsuarioComponent {
  dataSource: MatTableDataSource<Usuario>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: true },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'correo', label: 'Correo', hide: false },
    { def: 'rol', label: 'Rol', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('📦 Intentando cargar usuarios desde backend...');

    this.usuarioService.findAll().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos desde backend:', data);
        this.createTable(data);
      },
      error: (err) => {
        console.error('❌ Error al obtener usuarios:', err);
      },
    });
  }

  createTable(data: Usuario[]) {
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

  openDialog(usuario?: Usuario) {
    this._dialog.open(UsuarioDialogComponent, {
      width: '750px',
      data: usuario,
    });
  }

  openDeleteDialog(usuario: Usuario) {
    const dialogRef = this._dialog.open(UsuarioDeleteDialogComponent, {
      width: '400px',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
