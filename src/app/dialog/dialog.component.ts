import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  userForm!: FormGroup;
  actionBtn: string = 'Save';
  dialogTitle: string = 'Add User';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      address: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Update';
      this.dialogTitle = 'Update User';
      this.userForm.controls['name'].setValue(this.editData.name);
      this.userForm.controls['contact'].setValue(this.editData.contact);
      this.userForm.controls['address'].setValue(this.editData.address);
    }
    // console.log(this.editData);
  }

  addUser() {
    if (!this.editData) {
      if (this.userForm.valid) {
        this.api.postUser(this.userForm.value).subscribe({
          next: (res) => {
            this.snackBar.open('User added successfully.', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
            });
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            this.snackBar.open('Error while adding the user!', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
            });
          },
        });
      }
    } else {
      this.updateUser();
    }
  }

  updateUser() {
    this.api.putUser(this.userForm.value, this.editData.id).subscribe({
      next: (res) => {
        this.snackBar.open('User updated successfully.', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.userForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        this.snackBar.open('Error while updating the user!', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
    });
  }
}
