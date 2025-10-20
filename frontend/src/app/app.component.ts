import {Component} from '@angular/core';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

@Component({
    standalone: true, // componente standalone, non serve dichiararlo in un NgModule (può vivere da solo e importare direttamente ciò di cui ha bisogno)
    selector: 'app-root', // nome del tag HTML che rappresenta questo componente nel body dell'index
    template: `
        <main>
            <header class="brand-name">
                <!-- <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true"/> -->
                <div class="d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                    </svg>
                    <span class="fs-4 fw-semibold">Homes</span>
                </div>

            </header>
            <section class="content">
                <router-outlet></router-outlet>
            </section>
        </main>`,
    styleUrls: ['./app.component.css'], // file css collegato per lo style
    imports: [RouterModule, HttpClientModule] // importa il modulo per la route utilizzabile da questo standalone
})
export class AppComponent {
    title = 'homes'; // proprietà usata come titolo dell'app
}
