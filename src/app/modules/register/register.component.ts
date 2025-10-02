import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from './register.store';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  providers: [Store],
  template: `
    @if(vm$ | async; as vm){ @if(vm.isLoading){
    <app-spinner />
    }
    <section id="register-login-page" class="bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- LOGIN -->
          <div
            class="md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-10 md:m-10"
          >
            <h2 class="text-2xl font-semibold mb-4">Login</h2>

            @if(vm.loginForm; as loginForm){
            <form [formGroup]="loginForm" (ngSubmit)="store.onLoginSubmit()">
              <div class="mb-3">
                <label for="login-email" class="block">Email</label>
                <input
                  type="email"
                  id="login-email"
                  formControlName="email"
                  autocomplete="username"
                  class="w-full px-3 py-1 border rounded-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="
                    loginForm.get('email')?.invalid &&
                    (loginForm.get('email')?.touched || vm.loginSubmitted)
                  "
                  required
                />
                @if (loginForm.get('email')?.errors?.['required'] &&
                (loginForm.get('email')?.touched || vm.loginSubmitted)) {
                <p class="text-sm text-red-600 mt-1">El email es requerido.</p>
                } @if (loginForm.get('email')?.errors?.['email'] &&
                (loginForm.get('email')?.touched || vm.loginSubmitted)) {
                <p class="text-sm text-red-600 mt-1">
                  Formato de email inválido.
                </p>
                }
              </div>

              <div class="mb-3">
                <label for="login-password" class="block">Password</label>
                <input
                  type="password"
                  id="login-password"
                  autocomplete="current-password"
                  formControlName="password"
                  class="w-full px-3 py-1 border rounded-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="
                    loginForm.get('password')?.invalid &&
                    (loginForm.get('password')?.touched || vm.loginSubmitted)
                  "
                  required
                />
                @if (loginForm.get('password')?.errors?.['required'] &&
                (loginForm.get('password')?.touched || vm.loginSubmitted)) {
                <p class="text-sm text-red-600 mt-1">
                  La contraseña es requerida.
                </p>
                } @if (loginForm.get('password')?.errors?.['minlength'] &&
                (loginForm.get('password')?.touched || vm.loginSubmitted)) {
                <p class="text-sm text-red-600 mt-1">Mínimo 8 caracteres.</p>
                }
              </div>

              <!--<div class="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="remember-me"
                  class="mr-2"
                  formControlName="rememberMe"
                />
                <label for="remember-me">Remember Me</label>
              </div>

              <div class="mb-3">
                <a href="#" class="text-primary hover:underline"
                  >Forgot Password?</a
                >
              </div>-->

              <button
                type="submit"
                [disabled]="loginForm.invalid || vm.isLoading"
                class="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-3 rounded-full w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ vm.isLoading ? 'Ingresando...' : 'Login' }}
              </button>
            </form>
            }
          </div>

          <!-- REGISTER -->
          <div
            class="md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-10 md:m-10"
          >
            <h2 class="text-2xl font-semibold mb-4">Register</h2>

            @if(vm.registerForm;as registerForm){
            <form
              [formGroup]="registerForm"
              (ngSubmit)="store.onRegisterSubmit()"
            >
              <div class="mb-3">
                <label for="register-email" class="block">Email</label>
                <input
                  type="email"
                  id="register-email"
                  autocomplete="username"
                  formControlName="email"
                  class="w-full px-3 py-1 border rounded-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="
                    registerForm.get('email')?.invalid &&
                    (registerForm.get('email')?.touched || vm.registerSubmitted)
                  "
                  required
                />
                @if (registerForm.get('email')?.errors?.['required'] &&
                (registerForm.get('email')?.touched || vm.registerSubmitted)) {
                <p class="text-sm text-red-600 mt-1">El email es requerido.</p>
                } @if (registerForm.get('email')?.errors?.['email'] &&
                (registerForm.get('email')?.touched || vm.registerSubmitted)) {
                <p class="text-sm text-red-600 mt-1">
                  Formato de email inválido.
                </p>
                }
              </div>

              <div class="mb-3">
                <label for="register-password" class="block">Password</label>
                <input
                  type="password"
                  id="register-password"
                  formControlName="password"
                  autocomplete="new-password"
                  class="w-full px-3 py-1 border rounded-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="
                    registerForm.get('password')?.invalid &&
                    (registerForm.get('password')?.touched ||
                      vm.registerSubmitted)
                  "
                  required
                />
                @if (registerForm.get('password')?.errors?.['required'] &&
                (registerForm.get('password')?.touched || vm.registerSubmitted))
                {
                <p class="text-sm text-red-600 mt-1">
                  La contraseña es requerida.
                </p>
                } @if (registerForm.get('password')?.errors?.['minlength'] &&
                (registerForm.get('password')?.touched || vm.registerSubmitted))
                {
                <p class="text-sm text-red-600 mt-1">Mínimo 8 caracteres.</p>
                }
              </div>

              <div class="mb-3">
                <label for="register-confirm-password" class="block"
                  >Confirm Password</label
                >
                <input
                  type="password"
                  id="register-confirm-password"
                  formControlName="confirmPassword"
                  autocomplete="new-password"
                  class="w-full px-3 py-1 border rounded-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="(registerForm.get('confirmPassword')?.touched || vm.registerSubmitted) && (registerForm.get('confirmPassword')?.invalid || registerForm.errors?.['fieldsDontMatch'])"
                  required
                />
                @if (registerForm.get('confirmPassword')?.errors?.['required']
                && (registerForm.get('confirmPassword')?.touched ||
                vm.registerSubmitted)) {
                <p class="text-sm text-red-600 mt-1">
                  La confirmación es requerida.
                </p>
                } @if (registerForm.errors?.['fieldsDontMatch'] &&
                (registerForm.get('confirmPassword')?.touched ||
                vm.registerSubmitted)) {
                <p class="text-sm text-red-600 mt-1">
                  Las contraseñas no coinciden.
                </p>
                }
              </div>

              <button
                type="submit"
                [disabled]="registerForm.invalid || vm.isLoading"
                class="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-3 rounded-full w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ vm.isLoading ? 'Registrando...' : 'Register' }}
              </button>
            </form>
            }
          </div>
        </div>
      </div>
    </section>
    }
  `,
})
export class RegisterComponent {
  protected readonly store = inject(Store);
  protected readonly vm$ = this.store.vm$;

  constructor() {
    this.store.loadData();
  }
}
