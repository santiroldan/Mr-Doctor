import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';
import { global } from 'src/app/services/global';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['../post-new/post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {
  public page_title: string;
  public identity;
  public token;
  public post: Post;
  public categories;
  public status: string;
  public url;

  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };
  
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: "50",
    uploadAPI:  {
      url: global.url + "post/upload",
      headers: {
        "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Máx 50 MB"
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService,
    private titleService: Title
  ) { 
    this.page_title = "Editar entrada";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
    this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );
  }

  ngOnInit(){
    this.getCategories();
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null);
    this.getPost();
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status="success"){
          this.categories = response.categories;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  imageUpload(data){
    let info = JSON.parse(data.response);
    this.post.image = info.image;
  }

  onSubmit(form){
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = "success";
          this._router.navigate(['/entrada', this.post.id]);
        }
        else{
          this.status = "error";
        }
      },
      error => {
        this.status = "error";
        console.log(error);
      }
    );
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
              if(this.post.user_id != this.identity.sub){
                this._router.navigate(['/inicio']);
              }
                
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
}
