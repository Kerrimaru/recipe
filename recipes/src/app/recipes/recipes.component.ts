import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
// const Firebase = require('firebase');

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [],
})
export class RecipesComponent implements OnInit {
  constructor(private authService: AuthService) {}
  user: User;
  search: string;
  private userSub: Subscription;

  ngOnInit(): void {
    // const fbRef = window['firebase'];
    // const dbRef = fbRef.database().ref().child('object');
    // console.log('FB ref: ', fbRef, ' db ref: ', dbRef);
    // dbRef.on('value', snap => console.log(snap.val()));
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }
}
