import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent { 
  constructor(private _AuthService:AuthService, private _Router:Router){}

  loading:boolean= false;
  errorOrSuccess!:String;
  responseMssg!:String;
  registerSub!:Subscription;
  intervalId!:any;

  passwordVisible: boolean = false;

  get isPasswordFilled(): boolean {
    return !!this.registerForm.get('password')?.value;
  }
  
 

  registerForm: FormGroup = new FormGroup({
    name:new FormControl (null, [Validators.required , Validators.minLength(3), Validators.maxLength(15)]),
    email:new FormControl (null, [Validators.required, Validators.email]),
    password:new FormControl (null , [Validators.required , Validators.pattern(/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/)]),
    confirmPassword:new FormControl (null , [Validators.required , Validators.pattern(/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/)]),
  }, this.confirmPass)

  confirmPass(g:AbstractControl):(null|object){
    if (g.get('password')?.value === g.get('confirmPassword')?.value){
      return null;
    }
    else{
      return {missMatch: true}
    }
  }

  submit():void{
    if(this.registerForm.valid){
      console.log(this.registerForm);
      this.loading=true;
      this.registerSub = this._AuthService.register(this.registerForm.value).subscribe({
        next:(response)=>{console.log(response)
          this.responseMssg=response.message;
          this.loading=false;
          this.errorOrSuccess='success';
          this.intervalId=setInterval( ()=>
          {
            this._Router.navigate(['/auth/CodeVerfication'], {
      queryParams: { email: this.registerForm.value.email }
    })
          },2000)
        },
        error:(error)=>{
          console.log(error);
        this.responseMssg=error.error.message;
        this.loading=false;
        this.errorOrSuccess='error';

      },
        complete:()=> {}

      })
    
    }
    else{
      this.registerForm.setErrors({'missMatch':true});
      this.registerForm.markAllAsTouched();
    }
    
  }

  ngOnDestroy():void{
    this.registerSub?.unsubscribe();  clearInterval(this.intervalId)

  }
}
