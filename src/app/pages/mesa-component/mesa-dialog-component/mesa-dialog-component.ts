import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Mesa } from '../../../model/mesa';
import { MesaService } from '../../../services/mesa-service';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesa-dialog-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './mesa-dialog-component.html',
  styleUrl: './mesa-dialog-component.css',
})
export class MesaDialogComponent {
  mesa: Mesa;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Mesa,
    private _dialogRef: MatDialogRef<MesaDialogComponent>,
    private mesaService: MesaService
  ) {}

  ngOnInit(): void {
    this.mesa = this.data ? { ...this.data } : new Mesa();
  }

  operate() {
    if (this.mesa != null && this.mesa.id > 0) {
      this.mesaService
        .update(this.mesa.id, this.mesa)
        .pipe(switchMap(() => this.mesaService.findAll()))
        .subscribe((data) => {
          this.mesaService.setMesaChange(data);
          this.mesaService.setMessageChange('MESA UPDATED!');
        });

      this.close();
    } else {
      this.mesaService
        .save(this.mesa)
        .pipe(switchMap(() => this.mesaService.findAll()))
        .subscribe((data) => {
          this.mesaService.setMesaChange(data);
          this.mesaService.setMessageChange('MESA CREATED!');
        });

      this.close();
    }
  }

  close() {
    this._dialogRef.close();
  }
}
