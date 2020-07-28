import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  public page_title: string;
  constructor(
    private titleService: Title
  ) {
    this.page_title = "Página no encontrada.";
    this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );
   }

  ngOnInit(): void {
  }

}
