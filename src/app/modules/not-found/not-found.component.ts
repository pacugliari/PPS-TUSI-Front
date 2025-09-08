import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  template: `
    <!-- 404 -->
    <section
      id="404-page"
      class="bg-white py-16 flex items-center justify-center min-h-screen"
    >
      <div class="mx-auto max-w-screen-lg px-4 md:px-8">
        <div class="grid gap-8 sm:grid-cols-2">
          <!-- content - start -->
          <div
            class="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32"
          >
            <h1 class="text-4xl font-bold text-primary mb-5">
              404 - Page Not Found
            </h1>
            <p class="text-gray-txt mb-5">
              The page you are looking for might have been removed, renamed, or
              is temporarily unavailable.
            </p>
            <a
              href="/"
              class="bg-primary hover:bg-transparent border border-transparent hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full inline-block"
              >Go back</a
            >
          </div>
          <!-- content - end -->
          <!-- image - start -->
          <div
            class="relative h-80 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto"
          >
            <img
              src="assets/images/404.jpg"
              alt="Image"
              class="w-full h-auto"
            />
          </div>
          <!-- image - end -->
        </div>
      </div>
    </section>
  `,
})
export class NotFoundComponent {}
