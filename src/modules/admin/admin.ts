import { Component } from '@angular/core';
import { Toolbar } from "./layout/toolbar/toolbar";
import { Bottombar } from "./layout/bottombar/bottombar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [Toolbar, Bottombar, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

}
