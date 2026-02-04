import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserServices {
  http = inject(HttpClient);

  getUsers() {
    return this.http.get<any>('http://localhost:4000/users');
  }

  addUser(data: any) {
    return this.http.post<any>('http://localhost:4000/users', data);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`http://localhost:4000/users/${id}`);
  }

  getUserById(id: string) {
    return this.http.get<any>(`http://localhost:4000/users/${id}`);
  }

  updateUser(id: string, data: any) {
    return this.http.put<any>(`http://localhost:4000/users/${id}`, data);
  }

  getPresignedUrl(fileName: string) {
    return this.http.post<any>('http://localhost:4000/files/upload', { fileName });
  }

  getViewUrl(fileName: string) {
    return this.http.get<any>(`http://localhost:4000/files/view/${fileName}`);
  }

  deleteFile(fileName: string) {
    return this.http.delete(`http://localhost:4000/files/${fileName}`);
  }

  downloadFile(fileName: string) {
    return this.http.get(`http://localhost:4000/files/download/${fileName}`, {
      responseType: 'blob',
    });
  }
}
