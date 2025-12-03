import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Menu } from '../../../model/menu';
import { MenuService } from '../../../services/menu-service';

@Component({
  selector: 'app-menu-delete-dialog',
  templateUrl: './menu-delete-dialog-component.html',
  imports: [MatDialogContent, MatDialogActions],
})
export class MenuDeleteDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Menu,
    private dialogRef: MatDialogRef<MenuDeleteDialogComponent>,
    private menuService: MenuService
  ) {}

  confirmDelete() {
    this.menuService.delete(this.data.id).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
