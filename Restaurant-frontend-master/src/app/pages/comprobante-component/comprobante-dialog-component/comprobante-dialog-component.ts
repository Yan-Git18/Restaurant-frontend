import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { switchMap } from 'rxjs';

import { Comprobante } from '../../../model/comprobante';
import { Venta } from '../../../model/venta';
import { ComprobanteService } from '../../../services/comprobante-service';
import { VentaService } from '../../../services/venta-service';

@Component({
  selector: 'app-comprobante-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './comprobante-dialog-component.html',
  styleUrls: ['./comprobante-dialog-component.css'],
})
export cla