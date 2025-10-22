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
        <div *ngIf="!loading && filteredApplications.length > 0" class="table-responsive">
            <table class="table table-striped table-hover table-bordered">
                <thead class="table-dark">
                <tr>
                    <th scope="col" (click)="toggleSort('firstName')" style="cursor: pointer;">
                        First Name
                        <span *ngIf="sortColumn==='firstName'">({{ sortDirection }})</span>
                    </th>
                    <th scope="col" (click)="toggleSort('lastName')" style="cursor: pointer;">
                        Last Name
                        <span *ngIf="sortColumn==='lastName'">({{ sortDirection }})</span>
                    </th>
                    <th scope="col" (click)="toggleSort('email')" style="cursor: pointer;">
                        Email
                        <span *ngIf="sortColumn==='email'">({{ sortDirection }})</span>
                    </th>
                    <th scope="col" (click)="toggleSort('createdAt')" style="cursor: pointer;">
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
                <caption>Lista degli utenti</caption>
            </table>

            <nav aria-label="Page navigation" class="mt-3">
                <ul class="pagination justify-content-center mb-0">
                    <li class="page-item" [class.disabled]="page === 1">
                        <button class="page-link" type="button"
                                (click)="goToPage(1)" [disabled]="page === 1">« First
                        </button>
                    </li>
                    <li class="page-item" [class.disabled]="page === 1">
                        <button class="page-link" type="button"
                                (click)="goToPage(page - 1)" [disabled]="page === 1">‹ Prev
                        </button>
                    </li>
                    <li class="page-item disabled">
                        <span class="page-link">Page {{ page }} / {{ totalPages }}</span>
                    </li>
                    <li class="page-item" [class.disabled]="page === totalPages">
                        <button class="page-link" type="button"
                                (click)="goToPage(page + 1)" [disabled]="page === totalPages">Next ›
                        </button>
                    </li>
                    <li class="page-item" [class.disabled]="page === totalPages">
                        <button class="page-link" type="button"
                                (click)="goToPage(totalPages)" [disabled]="page === totalPages">Last »
                        </button>
                    </li>
                </ul>
            </nav>
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
        console.log(this.houseName)
    }

    fetchData() {
        this.loading = true;
        this.http.get<Application[]>(`http://localhost:3000/applications/house/${encodeURIComponent(this.houseName)}`)
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
            a.firstName.toLowerCase().includes(q)
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
