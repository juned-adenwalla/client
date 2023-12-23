import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }
  private authKey = 'auth';

  getUser() {
    const authData = sessionStorage.getItem(this.authKey);
    return authData ? JSON.parse(authData) : undefined;
  }

  userLogin(userdata:any){
    sessionStorage.setItem(this.authKey, JSON.stringify(userdata));
    Swal.fire("Success","Login Successfull :)","success");
  }

  userLogout(){
    sessionStorage.removeItem(this.authKey);
    this.router.navigate(['/login']);
  }

  updateUser(userdata:any){
    sessionStorage.removeItem(this.authKey);
    sessionStorage.setItem(this.authKey, JSON.stringify(userdata));
  }
}
