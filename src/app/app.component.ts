import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'task-crud-app';

  displayedColumns: string[] = ['id', 'name', 'contact', 'address', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }
  openDialog() {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllUsers();
        }
      });
  }
  getAllUsers() {
    this.api.getUser().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      error: () => {
        this.snackBar.open('Error while fetching!', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
    });
  }
  editUser(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllUsers();
        }
      });
  }
  deleteUser(id: number) {
    this.api.deleteUser(id).subscribe({
      next: (res) => {
        this.snackBar.open('User deleted successfully.', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.getAllUsers();
      },
      error: () => {
        this.snackBar.open('Error while deleting the user!', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
    });
  }
}
