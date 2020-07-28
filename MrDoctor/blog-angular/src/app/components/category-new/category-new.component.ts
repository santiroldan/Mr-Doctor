import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css'],
  providers: [UserService, CategoryService]
})
export class CategoryNewComponent implements OnInit {
  public page_title: string;
  public identity;
  public token;
  public category: Category;
  public status: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private titleService: Title
  ) { 
    this.page_title = "Crear categoria";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.category = new Category(1, '');
    this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._categoryService.create(this.token, this.category).subscribe(
      response => {
        if(response.status == 'success'){
          this.category = response.category;
          this.status = 'success';

          this._router.navigate(['/inicio']);
        }
        else{
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}
