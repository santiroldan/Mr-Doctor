import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {

  public page_title: string;
  public url;
  public posts: Array<Post>;
  public user: User;
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private titleService: Title
  ) { 
    this.page_title = "Mis publicaciones"
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );
  }

  ngOnInit() {
    this.getProfile();
  }

  getPosts(userId){
    this._userService.getPosts(userId).subscribe(
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

  getUser(userId){
    this._userService.getUser(userId).subscribe(
      response => {
        if(response.status == "success"){
          this.user = response.user;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getProfile(){
    // Sacar el id del post de la url
    this._route.params.subscribe(
      params => {
        let userId = +params['id'];
        this.getUser(userId);
        this.getPosts(userId);
      });
  }

  deletePost(id){
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getProfile();
      },
      error => {
        console.log(error);
      }
    );
  }
}
