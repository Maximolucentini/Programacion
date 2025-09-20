import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

}
