import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  providers: [UserService, PostService]
})
export class PostListComponent implements OnInit {
  @Input() posts;
  @Input() identity;
  @Input() url;
  @Input() token;

  public user: User;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
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

}
