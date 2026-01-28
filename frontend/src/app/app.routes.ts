import { Routes } from '@angular/router';
import { UserLists } from './pages/user-lists/user-lists';
import { UserCard } from './pages/user-card/user-card';

export const routes: Routes = [
   {
    path: 'allusers',
    
    children: [
      {
        path: '',
        component: UserLists,
      },
      {
        path: 'add',
        component: UserCard,
      },
      {
        path: ':id',
        component: UserCard,
      }
    ]

  }
];
