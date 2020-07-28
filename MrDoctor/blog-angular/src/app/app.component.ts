import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck{
  public page_title = 'Mr.Doctor';
  public identity;
  public token;
  public url;
  public categories;
  public page_actual;
  public ver_btn_arriba;
  public showScrollHeight;
  public hideScrollHeight;

  constructor(
    public _userService: UserService,
    public _categoryService: CategoryService,
  ){
    this.loadUser();
    this.url = global.url;
    this.page_actual = 1;
    this.ver_btn_arriba = false;
  }
  
  ngOnInit(){
    console.log('Bienvenido a Mr.Doctor.');
    this.getCategories();
    this.showScrollHeight = 50;
    this.hideScrollHeight = 10;
  }

  ngDoCheck(){
    this.loadUser();
  }

  loadUser(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status == "success"){
          this.categories = response.categories;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /*Scroll navbar*/
  scrollNavbar() {
    let element = document.querySelector('.navbar');
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('scroll-navbar');
    } else {
      element.classList.remove('scroll-navbar');
    }
  }

  scrollTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
  
  @HostListener('window:scroll', [])
    onWindowScroll() {
      if (( window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop) > this.showScrollHeight) {
        this.ver_btn_arriba = true;
      } else if ( this.ver_btn_arriba &&
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop)
        < this.hideScrollHeight) {
        this.ver_btn_arriba = false;
      }
    }
}
