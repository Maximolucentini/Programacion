import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-promos-admin',
  imports: [RouterLink,CommonModule],
  templateUrl: './promos-admin.html',
  styleUrl: './promos-admin.css'
})
export class PromosAdmin {

}
