import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedService } from '../../../shared/services/shared.service';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { CommonModule } from '@angular/common';
import { VALIDATORS } from '../../constants/to-do-list.constant';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-account',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPseudoCheckboxModule, ReactiveFormsModule, SnackBarComponent, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  @ViewChild('snackRef') snackBar!: SnackBarComponent;
  @ViewChild('learnMoreDialog') learnMoreDialog!: TemplateRef<any>;
  dialogRef !: MatDialogRef<any>
  signUpForm !: FormGroup;
  loading: boolean = false;
  hidePassword:boolean= true;
  constructor(private sharedService: SharedService,private dialog:MatDialog) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern(VALIDATORS.emailValidation)]),
      password: new FormControl(null, [Validators.required])
    });

    this.signUpForm.get('email')?.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((email) => this.sharedService.checkIfEmailExists(email))
    )
    .subscribe((exists) => {
     if (exists) {
       this.snackBar.open('cancel', 'Email already exists', 'error');
     }
    });
  }

  async signUp() {
    if (this.signUpForm.valid) {
      this.loading = true;
      try {
        const { email, password, name } = this.signUpForm.value;
        const data = await this.sharedService.signUp(email, password, name);
        if (data) {
          this.loading = false;
          this.snackBar.open('check_circle', 'Account created successfully!!  Please check your email and click the link to sign in.', 'success',5000);
          this.signUpForm.reset();
        }
      } catch (error: any) {
        this.loading = false;
        if (error.message) {
          this.snackBar.open('cancel', error.message, 'error');
        } else {
          this.snackBar.open('cancel', "Try again later", 'error');
        }
      }
    } else {
      this.snackBar.open('warning', 'Please fill all mandatory fields', 'warning');
    }
  }

  signUpWithGoogle() {
    // this.sharedService.signUpWithGoogle();
  }

  toggleInfo(){
    this.dialogRef= this.dialog.open(this.learnMoreDialog,{
      width: '400px',
      maxHeight: '80vh'
    });
  }

   closeDialog() {
    this.dialogRef.close();
  }
}
