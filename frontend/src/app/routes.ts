import {Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {DetailsComponent} from "./details/details.component";
import {LoginComponent} from "./login";
import {RegistrationComponent} from "./register";
import {ProfileComponent} from "./profile";
import {AuthGuard} from "./auth.guard";
import {AddHouseComponent} from "./AddHouseComponent"

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
        path: 'register',
        component: RegistrationComponent,
        title: 'Registration Page'
    },
    {
        path: 'profile',
        component: ProfileComponent, canActivate: [AuthGuard],
        title: 'Profile Page'
    },
    {
        path: 'add-house',
        component: AddHouseComponent,
        title: 'New House'
    },
    {
        path: 'submissions/:houseName',
        loadComponent: () =>
            import('./submissions/submissions.component')
                .then(c => c.SubmissionsComponent),
        title: 'Submissions Page'
    },
    {
        path: 'submissions',
        loadComponent: () =>
            import('./submissions/all-submissions.component')
                .then(c => c.AllSubmissionsComponent),
        title: 'All Submissions Page'
    },

];
// esporta la configurazione come default per importarla altrove
export default routeConfig;
