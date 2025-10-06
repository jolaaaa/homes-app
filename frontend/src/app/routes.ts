import {Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {DetailsComponent} from "./details/details.component";
import {LoginComponent} from "./login";
import {RegistrationComponent} from "./register";
import {ProfileComponent} from "./profile";

// configurazione delle rotte dell'applicazione
const routeConfig: Routes = [
    {
        path: '', //rotta vuota corrisponde all'URL base (http://localhost:4200/)
        component: LoginComponent,
        title: 'Login Page'
    },
    {
        path: 'details/:id', // rotta per la pagina dei dettagli, ognuno con il proprio id ( es: /details/2)
        component: DetailsComponent, // componente mostrato per questa rotta
        title: 'Details Page' // titolo pagina
    },
    {
        path: 'home',
        component: HomeComponent,
        title: 'Home Page'
    },
    {
        path:'register',
        component: RegistrationComponent,
        title: 'Registration Page'
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile Page'
    }
];
// esporta la configurazione come default per importarla altrove
export default routeConfig;
