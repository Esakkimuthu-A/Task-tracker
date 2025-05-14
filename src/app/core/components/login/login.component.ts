import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { VALIDATORS } from '../../constants/to-do-list.constant';
import { MatIconModule } from '@angular/material/icon';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, SnackBarComponent, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('snackRef') snackBar!: SnackBarComponent;
  loading: boolean = false;
  hidePassword:boolean= true;

  signInForm !: FormGroup;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(VALIDATORS.emailValidation)]),
      password: new FormControl(null, [Validators.required])
    });
  }


  async signIn() {
    if (this.signInForm.valid) {
      this.loading = true;
      try {
        const { email, password } = this.signInForm.value;
        const data = await this.sharedService.signIn(email, password);
        if (data) {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        }
      } catch (error: any) {
        this.loading = false;
        if (error.message) {
          this.snackBar.open('cancel', error.message, 'error');
        }
        else {
          this.snackBar.open('cancel', "Try again later", 'error');
        }
      }
    }
    else {
      this.snackBar.open('warning', 'Please fill all mandatory fields', 'warning');
    }
  }

}
