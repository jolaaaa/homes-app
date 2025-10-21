import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

interface Application {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    houseName: string;
}

@Component({
    selector: 'app-submissions',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    template: `
        <div class="submissions-container">
            <h2>Submissions per: "{{ houseName }}"</h2>

            <div *ngIf="loading" class="info">Caricamento...</div>
            <div *ngIf="error" class="error">{{ error }}</div>

            <div class="controls" *ngIf="!loading && !error">
                <div class="left">
                    <label>
                        Cerca:
                        <input type="search" [(ngModel)]="search" (ngModelChange)="applyFilters()"
                               placeholder="nome, cognome o email">
                    </label>
                </div>

                <div class="right">
                    <label>
                        Mostra
                        <select [(ngModel)]="pageSize" (change)="onPageSizeChange(); applyFilters()">
                            <option *ngFor="let s of pageSizes" [ngValue]="s">{{ s }}</option>
                        </select>
                        elementi per pagina
                    </label>
                </div>
            </div>

            <div *ngIf="!loading && filteredApplications.length === 0" class="info">
                Nessuna submission trovata per questa casa.
            </div>

            <div *ngIf="!loading && filteredApplications.length > 0" class="table-wrapper">
                <table class="data-table">
                    <thead>
                    <tr>
                        <th (click)="toggleSort('firstName')">
                            First Name
                            <span *ngIf="sortColumn==='firstName'">({{ sortDirection }})</span>
                        </th>
                        <th (click)="toggleSort('lastName')">
                            Last Name
                            <span *ngIf="sortColumn==='lastName'">({{ sortDirection }})</span>
                        </th>
                        <th (click)="toggleSort('email')">
                            Email
                            <span *ngIf="sortColumn==='email'">({{ sortDirection }})</span>
                        </th>
                        <th (click)="toggleSort('createdAt')">
                            Created
                            <span *ngIf="sortColumn==='createdAt'">({{ sortDirection }})</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let app of pagedData">
                        <td>{{ app.firstName }}</td>
                        <td>{{ app.lastName }}</td>
                        <td>{{ app.email }}</td>
                        <td>{{ app.createdAt | date:'medium' }}</td>
                    </tr>
                    </tbody>
                </table>


                <div class="pagination">
                    <button (click)="goToPage(1)" [disabled]="page===1">&laquo; first</button>
                    <button (click)="goToPage(page-1)" [disabled]="page===1">&lsaquo; prev</button>

                    <span>Page {{ page }} / {{ totalPages }}</span>

                    <button (click)="goToPage(page+1)" [disabled]="page===totalPages">next &rsaquo;</button>
                    <button (click)="goToPage(totalPages)" [disabled]="page===totalPages">last &raquo;</button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit {
    route = inject(ActivatedRoute);
    http = inject(HttpClient);

    houseName = '';
    allApplications: Application[] = [];
    filteredApplications: Application[] = [];

    search = '';
    sortColumn: keyof Application | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';

    page = 1;
    pageSize = 10;
    pageSizes = [5, 10, 20, 50];

    loading = false;
    error = '';

    ngOnInit(): void {
        this.houseName = this.route.snapshot.params['houseName'];
        this.fetchData();
    }

    fetchData() {
        this.loading = true;
        this.http.get<Application[]>(`/api/applications/house/${encodeURIComponent(this.houseName)}`)
            .subscribe({
                next: rows => {
                    this.allApplications = rows;
                    this.applyFilters();
                    this.loading = false;
                },
                error: err => {
                    console.error(err);
                    this.error = 'Errore nel recupero delle submissions.';
                    this.loading = false;
                }
            });
    }

    applyFilters() {
        const q = this.search.trim().toLowerCase();
        let list = this.allApplications.filter(a =>
            !q ||
            a.firstName.toLowerCase().includes(q) ||
            a.lastName.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q)
        );

        if (this.sortColumn !== null) {
            const column = this.sortColumn;
            list = [...list].sort((a, b) => {
                const A = a[column] ?? '';
                const B = b[column] ?? '';
                if (column === 'createdAt') {
                    return this.sortDirection === 'asc'
                        ? new Date(A).getTime() - new Date(B).getTime()
                        : new Date(B).getTime() - new Date(A).getTime();
                }
                return this.sortDirection === 'asc'
                    ? ('' + A).localeCompare('' + B)
                    : ('' + B).localeCompare('' + A);
            });
        }

        this.filteredApplications = list;
        this.page = 1;
    }

    toggleSort(column: keyof Application) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.applyFilters();
    }

    get totalPages() {
        return Math.max(1, Math.ceil(this.filteredApplications.length / this.pageSize));
    }

    get pagedData() {
        const start = (this.page - 1) * this.pageSize;
        return this.filteredApplications.slice(start, start + this.pageSize);
    }

    goToPage(n: number) {
        this.page = Math.min(Math.max(n, 1), this.totalPages);
    }

    onPageSizeChange() {
        this.page = 1;
    }
}
