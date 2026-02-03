import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { UserServices } from '../../user-services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-card',
  imports: [ReactiveFormsModule],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {

  userService = inject(UserServices);
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  users: any[] = [];
  router = inject(Router);
  route = inject(ActivatedRoute);

  paramsMap = toSignal(this.route.paramMap);
  userId = computed(() => this.paramsMap()?.get('id'));
  isEditMode = computed(() => !!this.userId());

  selectedFile!: File;

  userForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    age: ['', Validators.required],
    profilePic: ['']   
  });

  constructor() {
    effect(async () => {
      if (this.isEditMode() && this.userId()) {
        const res = await firstValueFrom(
          this.userService.getUserById(this.userId()!)
        );
        this.userForm.patchValue(res);
      }
    });
  }

  /* FILE SELECT → PRESIGN → PUT */
  async onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // 1️⃣ get presigned PUT url
    const presignRes = await firstValueFrom(
      this.userService.getPresignedUrl(file.name)
    );

    // 2️⃣ upload to MinIO
    await firstValueFrom(
      this.http.put(presignRes.uploadUrl, file, {
        headers: { 'Content-Type': file.type }
      })
    );

    // 3️⃣ SAVE ONLY fileName IN FORM
    this.userForm.patchValue({
      profilePic: presignRes.fileName
    });
  }

  removeProfilePic() {
    this.userForm.patchValue({ profilePic: '' });
    this.selectedFile = undefined as any;
  }

  async saveUsers() {
    if (this.userForm.invalid) {
      alert('Fill all fields');
      return;
    }

    const data = this.userForm.value;

    const API = this.isEditMode()
      ? this.userService.updateUser(this.userId()!, data)
      : this.userService.addUser(data);

    await firstValueFrom(API);

    this.userForm.reset();
    this.router.navigate(['/allusers']);
  }
}
