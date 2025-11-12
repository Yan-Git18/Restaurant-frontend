import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from '../../model/categoria';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaService } from '../../services/categoria-service';
import { CategoriaDialogComponent } from './categoria-dialog-component/categoria-dialog-component';
import { CategoriaDeleteDialogComponent } from './categoria-delete-dialog-component/categoria-delete-dialog.component';

@Component({
  selector: 'app-categoria',
  imports: [MaterialModule],
  templateUrl: './categoria-component.html',
  styleUrl: './categoria-component.css',
})
export class CategoriaComponent {
  dataSource: MatTableDataSource<Categoria>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoriaService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => console.error('Error al obtener categorías', err),
    });

    this.categoriaService.getCategoriaChange().subscribe(data => this.createTable(data));
  }

  createTable(data: Categoria[]) {
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

  openDialog(categoria?: Categoria) {
    this._dialog.open(CategoriaDialogComponent, {
      width: '650px',
      data: categoria,
    });
  }

  openDeleteDialog(categoria: Categoria) {
        const dialogRef = this._dialog.open(CategoriaDeleteDialogComponent, {
          width: '400px',
          data: categoria,
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this._snackBar.open('Categoria eliminada correctamente', 'Cerrar', {
              duration: 3000,
            });
          }
        });
      }
}