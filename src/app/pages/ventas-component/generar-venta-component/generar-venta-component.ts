import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';
import { VentaService } from '../../../services/venta-service';
import { environment } from '../../../../environments/environment.development';

interface PedidoDisponible {
  id: number;
  estado: string;
  cliente?: { id?: number; usuario?: any };
  // otros campos según tu API...
}

@Component({
  selector: 'app-generar-venta',
  templateUrl: './generar-venta-component.html',
  styleUrls: ['./generar-venta-component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule]
})
export class GenerarVentaComponent {
  form: FormGroup;
  pedidosDisponibles: PedidoDisponible[] = [];
  loadingPedidos = false;

  constructor(
    private dialogRef: MatDialogRef<GenerarVentaComponent>,
    private ventaService: VentaService,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      pedidoId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchPedidosDisponibles();
  }

  fetchPedidosDisponibles() {
    this.loadingPedidos = true;
    this.http.get<PedidoDisponible[]>(`${environment.HOST}/ventas/pedidos-disponibles`)
      .subscribe({
        next: (list) => {
          // backend ya filtra LISTO o ENTREGADO, sólo mostramos lo que llegue
          this.pedidosDisponibles = list;
          this.loadingPedidos = false;
        },
        error: (err) => {
          console.error(err);
          this.loadingPedidos = false;
          this.snackBar.open('Error cargando pedidos disponibles', 'Cerrar', { duration: 3000 });
        }
      });
  }

  generar() {
    if (this.form.invalid) return;

    const pedidoId = this.form.value.pedidoId;
    this.ventaService.generarVenta(pedidoId).subscribe({
      next: (venta) => {
        // Devolvemos la venta creada para que el componente padre la use si lo desea
        this.dialogRef.close(venta);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('No se pudo generar la venta: ' + (err?.error?.message || err.message || ''), 'Cerrar', { duration: 3500 });
      }
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  displayPedido(p: PedidoDisponible) {
    // Si tu objeto tiene cliente.nombre u otros campos
    const cliente = p?.cliente?.id ? `Cliente #${p.cliente.id}` : '';
    return `Pedido #${p.id} — ${p.estado} ${cliente}`;
  }
}
