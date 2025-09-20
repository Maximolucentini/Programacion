import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-admin',
  imports: [RouterLink,CommonModule],
  templateUrl: './historial-admin.html',
  styleUrl: './historial-admin.css'
})
export class HistorialAdmin {

}
