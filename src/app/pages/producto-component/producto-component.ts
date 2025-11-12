import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../../model/producto';
import { ProductoService } from '../../services/producto-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { ProductoDialogComponent } from './producto-dialog-component/producto-dialog-component';
import { ProductoDeleteDialogComponent } from './producto-delete-dialog-component/producto-delete-dialog-component';

@Component({
  selector: 'app-producto-component',
  imports: [MaterialModule],
  templateUrl: './producto-component.html',
  styleUrl: './producto-component.css',
})
export class ProductoComponent {
  dataSource: MatTableDataSource<Producto>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'descripcion', label: 'Descripción', hide: false },
    { def: 'precio', label: 'Precio', hide: false },
    { def: 'stock', label: 'Stock', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productoService: ProductoService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productoService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => console.error('Error al obtener productos:', err),
    });
  }

  createTable(data: Producto[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  openDialog(producto?: Producto) {
    this._dialog.open(ProductoDialogComponent, {
      width: '700px',
      data: producto,
    });
  }

  openDeleteDialog(producto: Producto) {
    const dialogRef = this._dialog.open(ProductoDeleteDialogComponent, {
      width: '400px',
      data: producto,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._snackBar.open('Producto eliminado correctamente', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}