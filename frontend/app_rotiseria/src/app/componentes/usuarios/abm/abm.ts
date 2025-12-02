import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-abm',
  standalone: true,
  imports: [],
  templateUrl: './abm.html',
  styleUrl: './abm.css'
})
export class Abm{

  @Input() userId!: string;
  @Input() tipoOperacion!: string;
}

