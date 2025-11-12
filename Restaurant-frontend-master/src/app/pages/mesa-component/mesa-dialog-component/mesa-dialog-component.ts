import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { Mesa } from '../../../model/mesa';
import { MesaService } from '../../../services/mesa-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-mesa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './mesa-dialog-component.html',
  styleUrls: ['./mesa-dialog-component.css'],
})
export class MesaDialogComponent {
  form: FormGroup;
  estados = ['Disponible', 'Ocupada', 'Reservada', 'Inactiva'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MesaDialogComponent>,
    private mesaService: MesaService,
    @Inject(MAT_DIALOG_DATA) public data: Mesa
  ) {
    this.form = this.fb.group({
      id: [data?.id],
      numero: [data?.numero || '', [Validators.required, Validators.min(1)]],
      ubicacion: [data?.ubicacion || '', [Validators.required, Validators.minLength(3)]],
      estado: [data?.estado || '', Validators.required],
    });
  }

  operate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const mesa: Mesa = this.form.value;
    const operacion = mesa.id
      ? this.mesaService.update(mesa.id, mesa)
      : this.mesaService.save(mesa);

    operacion.pipe(switchMap(() => this.mesaService.findAll())).subscribe({
      next: (data) => {
        this.mesaService.setMesaChange(data);
        this.mesaService.setMessageChange(
          mesa.id ? 'Mesa editada correctamente ✅' : 'Mesa creada correctamente ✅'
        );
        this.dialogRef.close(mesa.id ? 'edit' : 'create');
      },
      error: () => {
        this.mesaService.setMessageChange('❌ Error al guardar la mesa');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
