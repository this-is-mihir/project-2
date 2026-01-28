import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { UserServices } from '../../user-services';

@Component({
  selector: 'app-user-card',
  imports: [ReactiveFormsModule],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
userService = inject(UserServices);
fb = inject(FormBuilder);

users: any[] = [];
router = inject(Router);
route = inject(ActivatedRoute);

paramsMap = toSignal(this.route.paramMap);
userId = computed(() => this.paramsMap()?.get('id'));
isEditMode = computed(() => !!this.userId());

userForm = this.fb.group({
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required],
  age: ['', Validators.required],
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

async saveUsers() {
  if (this.userForm.invalid) {
    alert('Fill all fields');
    return;
  }

  const data = this.userForm.value;

  const API = this.isEditMode()
    ? this.userService.updateUser(this.userId()!, data)
    : this.userService.addUser(data);

  const res = await firstValueFrom(API);

  this.users.push(res);
  this.userForm.reset();

  this.router.navigate(['/allusers']);
}

}
