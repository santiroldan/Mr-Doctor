import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { global } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {
  public page_title: string;
  public category: Category;
  public posts: any;
  public url: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _postService: PostService,
    private titleService: Title
  ) { 
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(){
    this.getPostsByCategory();
  }

  getPostsByCategory(){
    this._route.params.subscribe(
      params => {
        let id = +params['id'];

        this._categoryService.getCategory(id).subscribe(
          response => {
            if(response.status == "success"){
              this.category = response.category;
              this.page_title = this.category.name;
              this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );

              this._categoryService.getPosts(id).subscribe(
                response => {
                  if(response.status = "success"){
                    this.posts = response.posts;
                  }
                  else{
                    this._router.navigate(['/inicio']);
                  }
                  
                },
                error => {
                  console.log(error);
                }
              );
            }
            else{
              console.log(response);
              this._router.navigate(['/inicio']);
            }
          },
          error => {
            console.log(error);
            this._router.navigate(['/inicio']);
          }
        );
      });
  }

  deletePost(id){
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getPostsByCategory();
      },
      error => {
        console.log(error);
      }
    );
  }
}
