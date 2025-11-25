import { Component } from '@angular/core';

@Component({
  selector: 'app-bottombar',
  imports: [],
  templateUrl: './bottombar.html',
  styleUrl: './bottombar.css',
})
export class Bottombar {
  currentYear = new Date().getFullYear();
}
