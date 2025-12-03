import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material-module';

import { Menu } from '../../../model/menu';

@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './menu-dialog-component.html',
})
export class MenuDialogComponent {

  form: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Menu
  ) {
    this.isEdit = !!data;

    this.form = this.fb.group({
      icon: [data?.icon || '', Validators.required],
      name: [data?.name || '', Validators.required],
      url: [data?.url || '', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) return;
    const menu = { ...this.data, ...this.form.value };
    this.dialogRef.close(menu);
  }

  close() {
    this.dialogRef.close();
  }
}
