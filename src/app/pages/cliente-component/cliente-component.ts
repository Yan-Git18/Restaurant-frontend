import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../../model/cliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClienteService } from '../../services/cliente-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../model/usuario';
import { ClienteDialogComponent } from './cliente-dialog-component/cliente-dialog-component';
import { ClienteDeleteDialogComponent } from './cliente-delete-dialog-component/cliente-delete-dialog-component';

@Component({
  selector: 'app-cliente',
  imports: [MaterialModule],
  templateUrl: './cliente-component.html',
  styleUrl: './cliente-component.css',
})
export class ClienteComponent {
  dataSource: MatTableDataSource<Cliente>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'telefono', label: 'Teléfono', hide: false },
    { def: 'direccion', label: 'Dirección', hide: false },
    { def: 'usuario', label: 'Usuario', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private clienteService: ClienteService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('📦 Intentando cargar usuarios desde backend...');

    this.clienteService.findAll().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos desde backend:', data);
        this.createTable(data);
      },
      error: (err) => {
        console.error('❌ Error al obtener usuarios:', err);
      },
    });
  }

  createTable(data: Cliente[]) {
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

  openDialog(cliente?: Cliente) {
    this._dialog.open(ClienteDialogComponent, {
      width: '750px',
      data: cliente,
    });
  }

  openDeleteDialog(cliente: Cliente) {
    const dialogRef = this._dialog.open(ClienteDeleteDialogComponent, {
      width: '400px',
      data: cliente,
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
