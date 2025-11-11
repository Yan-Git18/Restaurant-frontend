import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Reserva } from '../../../model/reserva';
import { ReservaService } from '../../../services/reserva-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Mesa } from '../../../model/mesa';
import { Cliente } from '../../../model/cliente';
import { MesaService } from '../../../services/mesa-service';
import { ClienteService } from '../../../services/cliente-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-reserva-dialog-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './reserva-dialog-component.html',
  styleUrl: './reserva-dialog-component.css',
})
export class ReservaDialogComponent {
  reserva: Reserva;
  mesas: Mesa[] = [];
  clientes: Cliente[] = [];
  fechaHoraLocal: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Reserva,
    private _dialogRef: MatDialogRef<ReservaDialogComponent>,
    private reservaService: ReservaService,
    private mesaService: MesaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.reserva = this.data ? { ...this.data } : new Reserva();

    // Convertir fecha a formato datetime-local si existe
    if (this.reserva.fechaHora) {
      this.fechaHoraLocal = this.convertToDatetimeLocal(this.reserva.fechaHora);
    }

    // Cargar mesas desde el backend
    this.mesaService.findAll().subscribe({
      next: (data) => (this.mesas = data),
      error: (err) => console.error('Error al cargar mesas', err),
    });

    // Cargar clientes desde el backend
    this.clienteService.findAll().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }

  // Convertir Date a formato datetime-local (YYYY-MM-DDTHH:mm)
  convertToDatetimeLocal(fecha: Date | string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  operate() {
    // Convertir la fecha del formato datetime-local a Date antes de guardar
    if (this.fechaHoraLocal) {
      this.reserva.fechaHora = new Date(this.fechaHoraLocal);
    }

    if (this.reserva != null && this.reserva.id > 0) {
      this.reservaService
        .update(this.reserva.id, this.reserva)
        .pipe(switchMap(() => this.reservaService.findAll()))
        .subscribe((data) => {
          this.reservaService.setReservaChange(data);
          this.reservaService.setMessageChange('RESERVA UPDATED!');
        });

      this.close();
    } else {
      this.reservaService
        .save(this.reserva)
        .pipe(switchMap(() => this.reservaService.findAll()))
        .subscribe((data) => {
          this.reservaService.setReservaChange(data);
          this.reservaService.setMessageChange('RESERVA CREATED!');
        });

      this.close();
    }
  }

  close() {
    this._dialogRef.close();
  }

  // Función para comparar clientes por ID
  compareCliente(c1: Cliente, c2: Cliente): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  // Función para comparar mesas por ID
  compareMesa(m1: Mesa, m2: Mesa): boolean {
    return m1 && m2 ? m1.id === m2.id : m1 === m2;
  }
}
