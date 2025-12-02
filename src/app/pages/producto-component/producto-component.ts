import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../../model/producto';
import { Categoria } from '../../model/categoria';
import { ProductoService } from '../../services/producto-service';
import { CategoriaService } from '../../services/categoria-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoDialogComponent } from './producto-dialog-component/producto-dialog-component';
import { ProductoDeleteDialogComponent } from './producto-delete-dialog-component/producto-delete-dialog-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto',
  imports: [MaterialModule, CommonModule],
  templateUrl: './producto-component.html',
  styleUrl: './producto-component.css',
})
export class ProductoComponent {
  dataSource: MatTableDataSource<Producto>;
  categorias: Categoria[] = [];

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'categoria', label: 'Categoría', hide: false },
    { def: 'precio', label: 'Precio', hide: false },
    { def: 'stockActual', label: 'Stock', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalStock: number = 0;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Refresh automático
    this.productoService.getProductoChange().subscribe((data) => {
      this.createTable(data);
      this.calculateStock(data);
    });
  }

  loadData() {
    this.productoService.findAll().subscribe((data) => {
      this.createTable(data);
      this.calculateStock(data);
    });

    this.categoriaService.findAll().subscribe((cats) => {
      this.categorias = cats;
    });
  }

  createTable(data: Producto[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  calculateStock(data: Producto[]) {
    this.totalStock = data.reduce((a, b) => a + b.stockActual, 0);
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  openDialog(producto?: Producto) {
    this._dialog.open(ProductoDialogComponent, {
      width: '700px',
      data: {
        producto,
        categorias: this.categorias,
      },
    });
  }

  openDeleteDialog(producto: Producto) {
    this._dialog.open(ProductoDeleteDialogComponent, {
      width: '400px',
      data: producto,
    });
  }

  getCategoriaNombre(id: number): string {
    const cat = this.categorias.find((c) => c.id === id);
    return cat ? cat.nombre : '—';
  }
}