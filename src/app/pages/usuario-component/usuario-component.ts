import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from './usuario-dialog-component/usuario-dialog-component';
import { UsuarioDeleteDialogComponent } from './usuario-delete-dialog-component/usuario-delete-dialog-component';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './usuario-component.html',
  styleUrls: ['./usuario-component.css'],
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();

    this.usuarioService.getUsuarioChange().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => console.error('Error en getUsuarioChange', err),
    });

    this.usuarioService.getMessageChange().subscribe((msg) => {
      this._snackBar.open(msg, 'Cerrar', { duration: 3000 });
    });
  }

  private loadAll() {
    this.usuarioService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => {
        this._snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      },
    });
  }

  createTable(data: Usuario[]) {
    this.dataSource = new MatTableDataSource(data || []);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const f = filter.trim().toLowerCase();
      const texto = `${data.nombre} ${data.correo} ${data.rol?.nombre}`.toLowerCase();
      return texto.includes(f);
    };
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  openDialog(usuario?: Usuario) {
    const dialogRef = this._dialog.open(UsuarioDialogComponent, {
      width: '750px',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'create') {
        this._snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 2500 });
      } else if (result === 'edit') {
        this._snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 2500 });
      }

      if (result) {
        this.usuarioService.findAll().subscribe({
          next: (data) => this.createTable(data),
        });
      }
    });
  }

  openDeleteDialog(usuario: Usuario) {
    const dialogRef = this._dialog.open(UsuarioDeleteDialogComponent, {
      width: '400px',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioService.findAll().subscribe({
          next: (data) => {
            this.createTable(data);
            this._snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }
}
