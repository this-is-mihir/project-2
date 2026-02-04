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

  async deleteUser(user: any) {

  // 1️⃣ MinIO file delete (अगर image है)
  if (user.profilePic) {
    await firstValueFrom(
      this.userService.deleteFile(user.profilePic)
    );
  }

  // 2️⃣ DB user delete
  await firstValueFrom(
    this.userService.deleteUser(user._id)
  );

  // 3️⃣ Refresh UI
  this.getUser();
}


  /* =========================
     DOWNLOAD PROFILE IMAGE
     ========================= */
  async downloadProfilePic(user: any) {
    if (!user.profilePic) return;

    const blob = await firstValueFrom(
      this.userService.downloadFile(user.profilePic)
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = user.profilePic;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  /* =========================
     DELETE PROFILE IMAGE
     ========================= */
  async deleteProfilePic(user: any) {
  if (!user.profilePic) return;

  // 1️⃣ delete from MinIO
  await firstValueFrom(
    this.userService.deleteFile(user.profilePic)
  );

  // 2️⃣ update user in DB (clear profilePic)
  await firstValueFrom(
    this.userService.updateUser(user._id, {
      ...user,
      profilePic: ''
    })
  );

  // 3️⃣ refresh UI
  this.getUser();
}

}


