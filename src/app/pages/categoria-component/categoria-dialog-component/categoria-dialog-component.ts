import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Categoria } from '../../../model/categoria';
import { CategoriaService } from '../../../services/categoria-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-categoria-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogContent, MatDialogActions],
  templateUrl: './categoria-dialog-component.html',
  styleUrl: './categoria-dialog-component.css',
})
export class CategoriaDialogComponent {
  categoria: Categoria = new Categoria();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Categoria,
    private _dialogRef: MatDialogRef<CategoriaDialogComponent>,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    if (this.data) this.categoria = { ...this.data };
  }

  operate() {
    const op = this.categoria.id
      ? this.categoriaService.update(this.categoria.id, this.categoria)
      : this.categoriaService.save(this.categoria);

    op.pipe(switchMap(() => this.categoriaService.findAll())).subscribe(data => {
      this.categoriaService.setCategoriaChange(data);
      this._dialogRef.close();
    });
  }

  close() {
    this._dialogRef.close();
  }
}