import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'qa-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
}