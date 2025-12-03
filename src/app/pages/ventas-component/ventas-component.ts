import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Venta } from '../../model/venta';
import { VentaService } from '../../services/venta-service';
import { GenerarVentaComponent } from './generar-venta-component/generar-venta-component';
import { PagoDialogComponent } from './pago-dialog-component/pago-dialog-component';
import { ComprobanteDialogComponent } from './comprobante-dialog-component/comprobante-dialog-component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './ventas-component.html',
  styleUrl: './ventas-component.css',
})
export class VentaComponent {
  dataSource = new MatTableDataSource<Venta>([]);
  displayedColumns = ['id', 'fecha', 'total', 'pedidoId', 'clienteId', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ventaService: VentaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVentas();

    // Opcional: actualiza cuando el servicio emite cambios
    this.ventaService.getVentaChange().subscribe(() => this.loadVentas());
  }

  loadVentas() {
    this.ventaService.findAll().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error cargando ventas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  openGenerarVenta() {
    const ref = this.dialog.open(GenerarVentaComponent, {
      width: '720px'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        // result es la Venta creada
        this.snackBar.open('Venta generada correctamente', 'Cerrar', { duration: 2500 });
        this.loadVentas();
      }
    });
  }

  openPagoDialog(venta: Venta) {
    const ref = this.dialog.open(PagoDialogComponent, {
      width: '480px',
      data: { venta }
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.snackBar.open('Pago registrado', 'Cerrar', { duration: 2500 });
        this.loadVentas();
      }
    });
  }

  openComprobanteDialog(venta: Venta) {
    const ref = this.dialog.open(ComprobanteDialogComponent, {
      width: '700px',
      data: { venta }
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.snackBar.open('Comprobante generado', 'Cerrar', { duration: 2500 });
        this.loadVentas();
      }
    });
  }
}
