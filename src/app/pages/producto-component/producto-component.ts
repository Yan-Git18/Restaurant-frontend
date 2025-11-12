import { Component, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaterialModule } from '../../material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../../model/producto';
import { ProductoService } from '../../services/producto-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductoDialogComponent } from './producto-dialog-component/producto-dialog-component';
import { ProductoDeleteDialogComponent } from './producto-delete-dialog-component/producto-delete-dialog-component';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, MaterialModule, DecimalPipe],
  templateUrl: './producto-component.html',
  styleUrls: ['./producto-component.css'],
})
export class ProductoComponent {
  dataSource: MatTableDataSource<Producto>;

  columnsDefinitions = [
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'precio', label: 'Precio', hide: false },
    { def: 'categoria', label: 'Categoría', hide: false },
    { def: 'inventario', label: 'Inventario', hide: false },
    { def: 'stockActual', label: 'Stock', hide: false },
    { def: 'descripcion', label: 'Descripción', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productoService: ProductoService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.productoService.getProductoChange().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => console.error('Error en productoChange', err),
    });
  }

  private loadAll() {
    this.productoService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => {
        console.error('❌ Error al obtener productos:', err);
        this._snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  createTable(data: Producto[]) {
    this.dataSource = new MatTableDataSource(data || []);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.filterPredicate = (data: Producto, filter: string) => {
      const f = filter.trim().toLowerCase();
      const categoria = data.categoria?.nombre ?? '';
      const inventario = data.inventario?.nombre ?? '';
      const texto =
       `${data.id} ${data.nombre} ${data.precio} ${categoria} ${inventario} ${data.stockActual} ${data.descripcion}`.toLowerCase();
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

  openDialog(producto?: Producto) {
    const dialogRef = this._dialog.open(ProductoDialogComponent, {
      width: '750px',
      data: producto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'create') {
        this._snackBar.open('Producto creado correctamente', 'Cerrar', { duration: 2500 });
      } else if (result === 'edit') {
        this._snackBar.open('Producto editado correctamente', 'Cerrar', { duration: 2500 });
      }
    });
  }

  openDeleteDialog(producto: Producto) {
    const dialogRef = this._dialog.open(ProductoDeleteDialogComponent, {
      width: '400px',
      data: producto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productoService.findAll().subscribe({
          next: (data) => {
            this.createTable(data);
            this._snackBar.open('Producto eliminado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => console.error('Error al recargar productos tras eliminación', err),
        });
      }
    });
  }
}