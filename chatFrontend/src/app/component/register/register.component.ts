import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IUser } from '../../interfaces/user.interfaces';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup

  constructor(private _fb: FormBuilder, private _userservice: UserService) {


    this.registerForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\+?[\d\s-]+$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[!@#$%^&*(),.?":{}|<>]/)
      ]]
    })
  }





  onRegisterSubmit() {
    if (this.registerForm.valid) {
      console.log("Register values are ", this.registerForm.value);

      const registerData: IUser = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone
      };

      this._userservice.registerUser(registerData).subscribe({
        next: (res: any) => {
          console.log("Response is ", res);

          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Registration Successful',
              text: res.message,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error("Error Response:", err);

          // Extract error message from response
          let errorMessage = 'Something went wrong. Please try again.';

          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: errorMessage,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
          });
        }
      });

    } else {
      console.log("Form is not valid");
    }
  }
}
