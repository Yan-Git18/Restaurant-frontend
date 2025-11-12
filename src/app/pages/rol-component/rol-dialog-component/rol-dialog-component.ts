import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Rol } from '../../../model/rol';
import { RolService } from '../../../services/rol-service';
import { switchMap } from 'rxjs';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-rol-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIcon
],
  templateUrl: './rol-dialog-component.html',
  styleUrl: './rol-dialog-component.css',
})
export class RolDialogComponent {
  rol: Rol;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Rol,
    private _diajogRef: MatDialogRef<RolDialogComponent>,
    private rolService: RolService
  ) {}  

  ngOnInit(): void {
    this.rol = {... this.data} //spread operator
  }

  operate() {
    if (this.rol != null && this.rol.id > 0) {
      this.rolService
        .update(this.rol.id, this.rol)
        .pipe(switchMap(() => this.rolService.findAll()))
        .subscribe((data) => {
          this.rolService.setRolChange(data);
          this.rolService.setMessageChange('SUPPLIER UPDATED!');
        });

        this.close();
    } else {
      this.rolService
        .save(this.rol)
        .pipe(switchMap(() => this.rolService.findAll()))
        .subscribe((data) => {
          this.rolService.setRolChange(data);
          this.rolService.setMessageChange('SUPPLIER CREATED!');
        });

        this.close();
    }
  }

  close() {
    this._diajogRef.close();
  }
}
