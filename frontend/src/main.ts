// ENTRY POINT
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideRouter} from "@angular/router";
import routeConfig from './app/routes';

// avvia applicazione Angular usando AppComponent
bootstrapApplication(AppComponent, {
    providers: [
        // inietta il servizio Router con la configurazione delle rotte
        provideRouter(routeConfig)
    ]
})
    // stampa dell'errore in console in caso vada qualcosa storto
    .catch(err => console.error(err));
