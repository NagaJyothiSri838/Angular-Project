import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;
  submitted = false;
  submittedData: any = null;
  skillsList: string[] = ['Angular', 'React', 'JavaScript', 'Node.js', 'Java', 'Python'];
  
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: [''],
      address: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      jobDescription: [''],
      skills: [[], Validators.required],
      projects: this.fb.array([this.initProject()])
    });
  }

  removeSkill(skillToRemove: string): void {
    const currentSkills = this.userForm.get('skills')?.value as string[];
    const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove);
    this.userForm.get('skills')?.setValue(updatedSkills);
  }

  get projects(): FormArray {
    return this.userForm.get('projects') as FormArray;
  }

  initProject(): FormGroup {
    return this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  addProject(): void {
    this.projects.push(this.initProject());
  }

  removeProject(index: number): void {
    if (this.projects.length > 1) {
      this.projects.removeAt(index);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.valid) {
      this.submittedData = this.userForm.value;
      console.log('Form submitted:', this.submittedData);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}