import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  template: `
    <section id="register-login-page" class="bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div
            class="md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-10 md:m-10"
          >
            <h2 class="text-2xl font-semibold mb-4">Login</h2>
            <form>
              <div class="mb-3">
                <label for="login-email" class="block ">Email</label>
                <input
                  type="email"
                  id="login-email"
                  class="w-full px-3 py-1 border  rounded-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="login-password" class="block ">Password</label>
                <input
                  type="password"
                  id="login-password"
                  class="w-full px-3 py-1 border  rounded-full focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div class="flex items-center mb-3">
                <input type="checkbox" id="remember-me" class="mr-2" />
                <label for="remember-me" class="">Remember Me</label>
              </div>
              <div class="mb-3">
                <a href="#" class="text-primary hover:underline"
                  >Forgot Password?</a
                >
              </div>
              <button
                type="submit"
                class="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-3 rounded-full w-full"
              >
                Login
              </button>
            </form>
          </div>
          <div
            class="md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-10 md:m-10"
          >
            <h2 class="text-2xl font-semibold mb-4">Register</h2>
            <form>
              <div class="mb-3">
                <label for="register-email" class="block ">Email</label>
                <input
                  type="email"
                  id="register-email"
                  class="w-full px-3 py-1 border focus:border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="register-password" class="block ">Password</label>
                <input
                  type="password"
                  id="register-password"
                  class="w-full px-3 py-1 border focus:border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="register-confirm-password" class="block "
                  >Confirm Password</label
                >
                <input
                  type="password"
                  id="register-confirm-password"
                  class="w-full px-3 py-1 border focus:border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <button
                type="submit"
                class="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-3 rounded-full w-full"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class RegisterComponent {}
