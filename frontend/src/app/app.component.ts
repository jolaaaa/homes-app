import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

@Component({
  standalone: true, // componente standalone, non serve dichiararlo in un NgModule (può vivere da solo e importare direttamente ciò di cui ha bisogno)
  selector: 'app-root', // nome del tag HTML che rappresenta questo componente nel body dell'index
  template: `
    <main>
      <header class="brand-name">
        <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true"/>
      </header>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>`,
  styleUrls: ['./app.component.css'], // file css collegato per lo style
  imports:[RouterModule, HttpClientModule] // importa il modulo per la route utilizzabile da questo standalone
})
export class AppComponent {
  title = 'homes'; // proprietà usata come titolo dell'app
}
