import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material-module';
import { Menu } from '../../model/menu';
import { MenuService } from '../../services/menu-service';
import { MenuDialogComponent } from './menu-dialog-component/menu-dialog-component';
import { MenuDeleteDialogComponent } from './menu-delete-dialog-component/menu-delete-dialog-component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './menu-component.html',
  styleUrls: ['./menu-component.css']
})
export class MenuComponent {

  dataSource: MatTableDataSource<Menu>;

  columnsDefinitions = [
    { def: 'id', label: 'ID', hide: true },
    { def: 'icon', label: 'Icono', hide: false },
    { def: 'name', label: 'Nombre', hide: false },
    { def: 'url', label: 'URL', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private menuService: MenuService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarMenus();
  }

  cargarMenus() {
    this.menuService.findAll().subscribe({
      next: (data) => this.createTable(data),
      error: (err) => {
        console.error('Error al cargar los menús', err);
        this._snackBar.open('Error al cargar los menús', 'Cerrar', { duration: 3000 });
      }
    });
  }

  createTable(data: Menu[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  openDialog(menu?: Menu) {
    const dialogRef = this._dialog.open(MenuDialogComponent, {
      width: '550px',
      data: menu,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!menu) {
          this.menuService.save(result).subscribe({
            next: () => {
              this._snackBar.open('Menu registrado correctamente', 'Cerrar', { duration: 3000 });
              this.cargarMenus();
            }
          });
        } else {
          this.menuService.update(result.id, result).subscribe({
            next: () => {
              this._snackBar.open('Menu actualizado correctamente', 'Cerrar', { duration: 3000 });
              this.cargarMenus();
            }
          });
        }
      }
    });
  }

  openDeleteDialog(menu: Menu) {
    const dialogRef = this._dialog.open(MenuDeleteDialogComponent, {
      width: '400px',
      data: menu,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarMenus();
      }
    });
  }
}
