import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  // List of valid username-password pairs
  validCredentials = [
  ];
  @Output() success = new EventEmitter<any>()

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public sharedService: SharedService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    this.loading = true
    const { username, password } = this.loginForm.value;
    
    // const isValid = this.validCredentials.some(
    //   (cred) => cred.username === username && cred.password === password
    // );
    let req = {
      username: username,
      password: password
    }

    this.sharedService.performLogin(req).subscribe((_res)=>{
      this.loading = false
      if(_res && _res.access_token) {
        localStorage.setItem('loginData', JSON.stringify(_res))
        localStorage.setItem('userEmail',username)
        this.success.emit(true)
        this.snackBar.open('Login Successful!', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } else {
        this.snackBar.open('Invalid username or password', 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    })

    
  }
}
