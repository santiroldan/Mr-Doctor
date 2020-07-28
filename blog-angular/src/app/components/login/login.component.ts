import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  public token;
  public identity;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private titleService: Title
  ) { 
    this.page_title = "Identifícate";
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.titleService.setTitle( 'Mr.Doctor | ' + this.page_title );
  }

  ngOnInit(){
    // Se ejecuta siempre y cierra sesión solo cuando le llega el parametro sure por la URL
    this.logout();
  }

  onSubmit(form){
    this._userService.signup(this.user).subscribe(
      response =>{
        // Token
        if(response.status != 'error'){
          this.status = 'Success';
          this.token = response;

          // Objeto Usuario Identificado
          this._userService.signup(this.user, true).subscribe(
            response =>{
                this.identity = response;
                
                // Sesión usuario
                localStorage.setItem('token', this.token);
                localStorage.setItem('identity', JSON.stringify(this.identity));

                // Redirección a Inicio
                this._router.navigate(['inicio']);
            },
            error => {
              this.status = 'Error';
              console.log(<any>error);
            }
          );
        }
        else{
          this.status = 'Error';
        }
      },
      error => {
        this.status = 'Error';
        console.log(<any>error);
      }
    );
  }

  logout(){
    this._route.params.subscribe(params => {
      let logout = +params['sure'];

      if(logout == 1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity = null;
        this.token = null;

        // Redirección a Inicio
        this._router.navigate(['inicio']);
      }
    });
  }
}
