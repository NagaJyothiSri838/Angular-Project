import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

interface User {
  name: string;
  email: string;
  profilePicture: string | SafeUrl | null;
  active?: boolean; 
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  showAddUserModal = false;
  userForm!: FormGroup;
  users: User[] = [];
  uploader!: FileUploader;
  previewUrl: string | SafeUrl | null = null;
  editingIndex: number | null = null;
  isEditMode = false;
  
  // Default profile picture (base64 encoded placeholder)
  defaultProfilePic = 'https://cdn-icons-png.flaticon.com/512/10337/10337609.png';

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeUploader();
    this.loadUsers();
  }

  private loadUsers(): void {
    this.users = [
      { name: 'John Doe', email: 'john@example.com', profilePicture: this.defaultProfilePic, active: true },
      { name: 'Jane Smith', email: 'jane@example.com', profilePicture: this.defaultProfilePic, active: false },
      { name: 'Bob Johnson', email: 'bob@example.com', profilePicture: this.defaultProfilePic, active: true }
    ];
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      profilePicture: [''],
      active: [true] 
    });
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: 'YOUR_UPLOAD_ENDPOINT',
      disableMultipart: false,
      itemAlias: 'profilePicture',
      autoUpload: false
    });

    this.uploader.onAfterAddingFile = (file: { withCredentials: boolean; _file: Blob; }) => {
      file.withCredentials = false;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file._file);
    };
  }

  openAddUserModal(): void {
    this.showAddUserModal = true;
    this.resetForm();
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.userForm.reset({ active: true });
    this.previewUrl = null;
    if (this.uploader) {
      this.uploader.clearQueue();
    }
    this.resetEditState();
  }

  addUser(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const newUser: User = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      profilePicture: this.previewUrl || this.defaultProfilePic,
      active: this.userForm.value.active
    };

    if (this.isEditMode && this.editingIndex !== null) {
      this.users[this.editingIndex] = newUser;
    } else {
      this.users.push(newUser);
    }

    this.closeAddUserModal();
  }

  editUser(index: number): void {
    this.editingIndex = index;
    this.isEditMode = true;
    const userToEdit = this.users[index];
    
    this.userForm.patchValue({
      name: userToEdit.name,
      email: userToEdit.email,
      active: userToEdit.active || true
    });
    
    this.previewUrl = userToEdit.profilePicture;
    this.showAddUserModal = true;
  }

  resetEditState(): void {
    this.editingIndex = null;
    this.isEditMode = false;
  }

  removeUser(index: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users.splice(index, 1);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get name() { return this.userForm.get('name'); }
  get email() { return this.userForm.get('email'); }
}







