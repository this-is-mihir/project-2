import { Component, effect, inject, signal } from '@angular/core';
import { UserServices } from '../../user-services';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-lists',
  imports: [RouterLink],
  templateUrl: './user-lists.html',
  styleUrl: './user-lists.css',
})
export class UserLists {

  userService = inject(UserServices);

  users = signal<any[]>([]);

  constructor() {
    effect(() => {
      this.getUser();
    });
  }

 async getUser() {
  const res = await firstValueFrom(this.userService.getUsers());

  for (const user of res) {
    if (user.profilePic && !user.profilePic.startsWith('http')) {
      const imgRes = await firstValueFrom(
        this.userService.getViewUrl(user.profilePic)
      );
      user.profilePicUrl = imgRes.viewUrl;


    }
  }

  this.users.set(res);
}


  async deleteUser(id: string) {
    await firstValueFrom(this.userService.deleteUser(id));
    this.getUser();
  }
}

