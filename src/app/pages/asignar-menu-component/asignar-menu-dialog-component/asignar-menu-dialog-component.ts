import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Menu } from '../../../model/menu';
import { Rol } from '../../../model/rol';

import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu-service';
import { MenuRolService } from '../../../services/menu-rol-service';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-asignar-menu-dialog-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './asignar-menu-dialog-component.html'
})
export class AsignarMenuDialogComponent {

  form: FormGroup;
  menus: Menu[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AsignarMenuDialogComponent>,
    private menuService: MenuService,
    private menuRolService: MenuRolService,
    @Inject(MAT_DIALOG_DATA) public data: { rol: Rol }
  ) {}

  ngOnInit() {
    this.menuService.findAll().subscribe({
      next: (m) => {
        console.log('MENUS RECIBIDOS →', m);
        this.menus = m;
      },
      error: err => console.error(err)
    });

    this.form = this.fb.group({
      idMenu: [null, Validators.required],
      idRol: [this.data.rol.id, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) return;

    this.menuRolService.asignarMenu(
      this.form.value.idMenu,
      this.form.value.idRol
    ).subscribe(() => this.dialogRef.close(true));
  }

  close() {
    this.dialogRef.close();
  }
}
