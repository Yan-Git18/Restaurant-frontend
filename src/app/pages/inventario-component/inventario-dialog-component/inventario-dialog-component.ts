import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material-module';
import { Inventario } from '../../../model/inventario';

@Component({
  selector: 'app-inventario-dialog-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './inventario-dialog-component.html',
  styleUrls: ['./inventario-dialog-component.css'],
})
export class InventarioDialogComponent implements OnInit {
  inventario: Inventario;
  esEdicion: boolean = false; 

  constructor(
    private dialogRef: MatDialogRef<InventarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Inventario
  ) {
    this.inventario = data ? { ...data } : new Inventario();
    this.esEdicion = !!data; 
  }

  ngOnInit(): void {}

  operate() {
    this.dialogRef.close(this.inventario);
  }

  close() {
    this.dialogRef.close();
  }
}
