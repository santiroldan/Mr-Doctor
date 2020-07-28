import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService, UserService]
})
export class HomeComponent implements OnInit {
  public page_title: string;
  public url;
  public posts: Array<Post>;
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private titleService: Title
  ) { 
    this.page_title = "Inicio";
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );
  }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(){
    this._postService.getPosts().subscribe(
      response => {
        if(response.status == "success"){
          this.posts = response.posts;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deletePost(id){
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getPosts();
      },
      error => {
        console.log(error);
      }
    );
  }
}