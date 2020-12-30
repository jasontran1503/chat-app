import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationsService } from 'src/app/common/layouts/notifications/notifications.service';
import { DataResponse } from 'src/app/common/models/data-response.model';
import { User } from 'src/app/common/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  submitted = false;

  destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.buildForm();
  }

  /**
   * Build form
   */
  buildForm(): FormGroup {
    return this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9]*$/),
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  get f(): any {
    return this.formGroup.controls;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const formValue = this.formGroup.getRawValue();
    // Register
    this.authService
      .register(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DataResponse<User>) => {
        if (response && response.success) {
          this.notifications.showToastSuccess(response.message);
          const loginValue = {
            email: formValue.email,
            password: formValue.password,
          };
          // Login
          this.login(loginValue);
          // Send mail
          this.sendMail(formValue.email);
        }
      });
  }

  /**
   * Login after register success
   * @param loginValue email & password
   */
  login(loginValue: { email: string; password: string }): void {
    this.authService
      .login(loginValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DataResponse<string>) => {
        if (response && response.success) {
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * Send mail when register success
   * @param email email
   */
  sendMail(email: string): void {
    this.authService.sendMail(email).pipe(takeUntil(this.destroy$)).subscribe();
  }

  /**
   * Match password
   * @param controlName controlName
   * @param matchingControlName matchingControlName
   */
  mustMatch(
    controlName: string,
    matchingControlName: string
  ): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
