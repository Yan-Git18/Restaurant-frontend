import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material-module';
import { Inventario } from '../../model/inventario';
import { InventarioService } from '../../services/inventario-service';
import { InventarioDialogComponent } from './inventario-dialog-component/inventario-dialog-component';
import { InventarioDeleteDialogComponent } from './inventario-delete-dialog-component/inventario-delete-dialog-component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './inventario-component.html',
  styleUrls: ['./inventario-component.css']
})
export class InventarioComponent {
  dataSource: MatTableDataSource<Inventario>;
  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: true },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'stockTotal', label: 'Stock Total', hide: false },
    { def: 'unidadMedida', label: 'Unidad', hide: false },
    { def: 'minimoStock', label: 'Mínimo', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private inventarioService: InventarioService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarInventarios();
  }

  // Cargar lista de inventarios
  cargarInventarios() {
    this.inventarioService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => {
        console.error('Error al obtener inventarios:', err);
        this._snackBar.open('Error al cargar los inventarios', 'Cerrar', { duration: 3000 });
      },
    });
  }

  createTable(data: Inventario[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  // Abrir diálogo de crear/editar
  openDialog(inventario?: Inventario) {
    const dialogRef = this._dialog.open(InventarioDialogComponent, {
      width: '700px',
      data: inventario,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!inventario) {
          // Registrar nuevo inventario
          this.inventarioService.save(result).subscribe({
            next: () => {
              this._snackBar.open('Inventario registrado correctamente', 'Cerrar', { duration: 3000 });
              this.cargarInventarios();
            },
            error: () => {
              this._snackBar.open('Error al registrar el inventario', 'Cerrar', { duration: 3000 });
            }
          });
        } else {
          // Actualizar inventario existente
          this.inventarioService.update(result.id, result).subscribe({
            next: () => {
              this._snackBar.open('Inventario actualizado correctamente', 'Cerrar', { duration: 3000 });
              this.cargarInventarios();
            },
            error: () => {
              this._snackBar.open('Error al actualizar el inventario', 'Cerrar', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  
 openDeleteDialog(inventario: Inventario) {
  const dialogRef = this._dialog.open(InventarioDeleteDialogComponent, {
    width: '400px',
    data: inventario,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Recargar la tabla después de eliminar
      this.cargarInventarios();
      this._snackBar.open('✅ Inventario eliminado correctamente', 'Cerrar', {
        duration: 3000,
      });
    }
  });
}

}

  

