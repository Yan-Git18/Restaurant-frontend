import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-panel-component',
  imports: [MaterialModule],
  templateUrl: './panel-component.html',
  styleUrl: './panel-component.css',
})
export class PanelComponent {

  correo: string;

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    const decodedToken = helper.decodeToken(token);
    this.correo = decodedToken.sub;
  }
}
