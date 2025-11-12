import { Component, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaterialModule } from '../../material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Comprobante } from '../../model/comprobante';
import { ComprobanteService } from '../../services/comprobante-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ComprobanteDialogComponent } from './comprobante-dialog-component/comprobante-dialog-component';
import { ComprobanteDeleteDialogComponent } from './comprobante-delete-dialog-component/comprobante-delete-dialog-component';

@Component({
  selector: 'app-comprobante',
  standalone: true,
  imports: [CommonModule, MaterialModule, DecimalPipe],
  templateUrl: './comprobante-component.html',
  styleUrls: ['./comprobante-component.css'],
})
export class ComprobanteComponent {
  dataSource: MatTableDataSource<Comprobante>;

  columnsDefinitions = [
    { def: 'numero', label: 'Número', hide: false },
    { def: 'fecha', label: 'Fecha', hide: false },
    { def: 'cliente', label: 'Cliente', hide: false },
    { def: 'total', label: 'Total', hide: false },
    { def: 'tipo', label: 'Tipo', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private comprobanteService: ComprobanteService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.comprobanteService.getComprobanteChange().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => console.error('Error en comprobanteChange', err),
    });
  }

  private loadAll() {
    this.comprobanteService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => {
        console.error('❌ Error al obtener comprobantes:', err);
        this._snackBar.open('Error al cargar comprobantes', 'Cerrar', { duration: 3000 });
      },
    });
  }

  createTable(data: Comprobante[]) {
    this.dataSource = new MatTableDataSource(data || []);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.filterPredicate = (data: Comprobante, filter: string) => {
      const f = filter.trim().toLowerCase();
      const cliente = data.cliente?.nombre ?? '';
      const texto = `${data.numero} ${data.fecha} ${cliente} ${data.total} ${data.tipo} ${data.estado}`.toLowerCase();
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

  openDialog(comprobante?: Comprobante) {
    const dialogRef = this._dialog.open(ComprobanteDialogComponent, {
      width: '750px',
      data: comprobante,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'create') {
        this._snackBar.open('Comprobante creado correctamente', 'Cerrar', { duration: 2500 });
      } else if (result === 'edit') {
        this._snackBar.open('Comprobante editado correctamente', 'Cerrar', { duration: 2500 });
      }
    });
  }

  openDeleteDialog(comprobante: Comprobante) {
    const dialogRef = this._dialog.open(ComprobanteDeleteDialogComponent, {
      width: '400px',
      data: comprobante,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.comprobanteService.findAll().subscribe({
          next: (data) => {
            this.createTable(data);
            this._snackBar.open('Comprobante eliminado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => console.error('Error al recargar comprobantes tras eliminación', err),
        });
      }
    });
  }
}