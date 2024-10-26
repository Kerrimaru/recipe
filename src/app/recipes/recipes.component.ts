import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Component, OnInit } from '@angular/core';
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
    // this.userSub = this.authService.user.subscribe((user) => {
    //   this.user = user;
    // });
  }
}
