import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'qa-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSearch(searchQuery: string): void {
    console.log('Header search triggered:', searchQuery);
    
    //  search query
    this.router.navigate(['/home'], {
      queryParams: { 
        search: searchQuery.trim() || null,
        page: null 
      },
      queryParamsHandling: 'merge'
    });
  }
}