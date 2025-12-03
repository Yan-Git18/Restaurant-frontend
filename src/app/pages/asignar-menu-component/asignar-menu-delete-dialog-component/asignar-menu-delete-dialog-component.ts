import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuRolService } from '../../../services/menu-rol-service';
import { Menu } from '../../../model/menu';
import { Rol } from '../../../model/rol';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-asignar-menu-delete-dialog-component',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './asignar-menu-delete-dialog-component.html',
})
export class AsignarMenuDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AsignarMenuDeleteDialogComponent>,
    private menuRolService: MenuRolService,
    @Inject(MAT_DIALOG_DATA) public data: { menu: Menu; rol: Rol }
  ) {}

  delete() {
    this.menuRolService
      .eliminarMenu(this.data.menu.id, this.data.rol.id)   
      .subscribe(() => this.dialogRef.close(true));
  }

  close() {
    this.dialogRef.close(false);
  }
}
