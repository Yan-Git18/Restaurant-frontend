import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Categoria } from '../../../model/categoria';
import { CategoriaService } from '../../../services/categoria-service';

@Component({
  selector: 'app-categoria-delete-dialog-component',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './categoria-delete-dialog-component.html',
  styleUrl: './categoria-delete-dialog-component.css',
})
export class CategoriaDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Categoria,
    private dialogRef: MatDialogRef<CategoriaDeleteDialogComponent>,
    private categoriaService: CategoriaService
  ) {}

  confirmDelete() {
    this.categoriaService.delete(this.data.id).subscribe({
      next: () => {
        this.categoriaService.findAll().subscribe((data) => {
          this.categoriaService.setCategoriaChange(data);
          this.categoriaService.setMessageChange('CATEGORIA ELIMINADA!');
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('Error al eliminar categoria', err);
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}