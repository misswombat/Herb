import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isExpanded: boolean;

  constructor() { }

  ngOnInit() {
    this.isExpanded = false;
  }

  toggleSubMenu() {
    this.isExpanded = !this.isExpanded;
  }

}
