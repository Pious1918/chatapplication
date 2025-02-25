import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IloginData } from '../../interfaces/user.interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!:FormGroup
  errorMessage: string | null = null;



  constructor(private _fb: FormBuilder, private _userService:UserService, private _router:Router) {

    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })


  }


  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log("Login form submitted", this.loginForm.value)

      const loginData: IloginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }

      this._userService.loginUser(loginData).subscribe((res: any) => {
        console.log("response after login", res)

        if (res.success) {
          console.log("Login successfully", res)
          localStorage.setItem('userToken', res.token)
          this._router.navigate(['/'])
        }

      },
        (error) => {
          
          this.errorMessage = error.error.message || 'An error occurred. Please try again.';
        }

      )
    }
  }
}
