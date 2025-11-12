import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Comprobante } from '../../model/comprobante';
import { ComprobanteService } from '../../services/comprobante-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { ComprobanteDialogComponent } from './comprobante-dialog-component/comprobante-dialog-component';
import { ComprobanteDeleteDialogComponent } from './comprobante-delete-dialog-component/comprobante-delete-dialog-component';

@Component({
  selector: 'app-comprobante-component',
  imports: [MaterialModule],
  templateUrl: './comprobante-component.html',
  styleUrl: './comprobante-component.css',
})
export class ComprobanteComponent {
  dataSource: MatTableDataSource<Comprobante>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: false },
    { def: 'tipo', label: 'Tipo', hide: false },
    { def: 'formato', label: 'Formato', hide: false },
    { def: 'numero', label: 'Número', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private comprobanteService: ComprobanteService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.comprobanteService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => console.error('Error al obtener comprobantes:', err),
    });
  }

  createTable(data: Comprobante[]) {
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

  openDialog(comprobante?: Comprobante) {
    this._dialog.open(ComprobanteDialogComponent, {
      width: '700px',
      data: comprobante,
    });
  }

  openDeleteDialog(comprobante: Comprobante) {
    const dialogRef = this._dialog.open(ComprobanteDeleteDialogComponent, {
      width: '400px',
      data: comprobante,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._snackBar.open('Comprobante eliminado correctamente', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}