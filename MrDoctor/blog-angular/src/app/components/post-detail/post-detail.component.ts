import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { Title } from '@angular/platform-browser';
import { global } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService, UserService]
})
export class PostDetailComponent implements OnInit {
  public page_title: string;
  public url;
  public post: Post;
  public category: Category;
  public user: User;
  public updated_at;
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _router: Router,
    private _route: ActivatedRoute,
    private titleService: Title,
    private _userService: UserService
  ) { 
    this.page_title = "Noticia";
    this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getPost();
  }

  getPost(){
    // Sacar el id del post de la url
    this._route.params.subscribe(
      params => {
        let id = +params['id'];
        // Petición ajax para sacar los datos del post
        this._postService.getPost(id).subscribe(
          response => {
            if(response.status == "success"){
                this.post = response.posts;
                this.category = response.posts.category;
                this.user = response.posts.user;
                this.updated_at = response.posts.updated_at;
            }
            else{
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
        this._router.navigate(['/inicio']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
