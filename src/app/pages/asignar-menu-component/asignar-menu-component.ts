import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Rol } from '../../model/rol';
import { Menu } from '../../model/menu';
import { RolService } from '../../services/rol-service';
import { MenuRolService } from '../../services/menu-rol-service';
import { MaterialModule } from '../../material/material-module';

import { AsignarMenuDialogComponent } from './asignar-menu-dialog-component/asignar-menu-dialog-component';
import { AsignarMenuDeleteDialogComponent } from './asignar-menu-delete-dialog-component/asignar-menu-delete-dialog-component';

@Component({
  selector: 'app-asignar-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],

  templateUrl: './asignar-menu-component.html',
})
export class AsignarMenuComponent {
  dataSource: MatTableDataSource<Menu>;
  roles: Rol[] = [];
  selectedRol: Rol | null = null;

  columns = ['id', 'name', 'icon', 'url', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rolService: RolService,
    private menuRolService: MenuRolService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.rolService.findAll().subscribe((r) => (this.roles = r));
  }

  onRolSelected() {
    if (!this.selectedRol) return;

    this.menuRolService.getMenusByRol(this.selectedRol.id).subscribe((menus) => {
      this.dataSource = new MatTableDataSource(menus);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialog() {
    const ref = this.dialog.open(AsignarMenuDialogComponent, {
      width: '550px',
      data: { rol: this.selectedRol },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.onRolSelected();
      }
    });
  }

  openDeleteDialog(menu: Menu) {
    const ref = this.dialog.open(AsignarMenuDeleteDialogComponent, {
      width: '400px',
      data: { menu, rol: this.selectedRol },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.onRolSelected();
      }
    });
  }
}
