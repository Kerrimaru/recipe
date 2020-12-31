import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { UserSettings } from '../auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private fb: AngularFireDatabase, public fbAuth: AngularFireAuth) {}
  userSettings: any;
  favourites: string[];
  favouritesList: AngularFireList<string>;
  favs$ = new BehaviorSubject<string[]>([]);

  userSettingsRef: firebase.database.Reference;
  favsRef: firebase.database.Reference;

  toggleFavourite(recipeKey: string) {
    this.favourites.includes(recipeKey)
      ? this.favsRef.child(recipeKey).remove()
      : this.favsRef.child(recipeKey).set(true);
  }

  setDiet(userId: string, diet: string) {
    // set diet
  }

  setTheme(userId: string, theme: string) {
    // set theme
  }

  saveChanges(userId) {
    return;
    // disabled until favourites is configured properly
    const settings = { diet: 'vegan', theme: 'default' };
    // to do: set method rewrites all values - could be dangerous for favourites
    this.fb.database.ref('userSettings/' + userId).update(settings);
  }

  // getFavourites(userId) {
  //   this.favsRef = this.fb.database.ref(`userSettings/${userId}/favourites`);
  //   this.favsRef.on('value', (snapshot) => {
  //     this.favourites = snapshot.val() || [];
  //     console.log('this.favourites: ', this.favourites, ' vel: ', snapshot.val());
  //   });
  // }

  fetchUserSettings(userId) {
    // console.log('fecth user setting');
    this.userSettingsRef = this.fb.database.ref(`userSettings/${userId}`);
    this.userSettingsRef.once('value').then((snapshot) => {
      // console.log('fecth user setting');
      this.userSettings = snapshot.val();
      // this.getFavourites(userId);
      this.fetchFavsList(userId);
    });
  }

  fetchFavsList(userId) {
    // console.log('fecth fav list');
    this.favsRef = this.fb.database.ref(`userSettings/${userId}/favourites`);
    this.favouritesList = this.fb.list(`userSettings/${userId}/favourites`);
    return this.favouritesList
      .snapshotChanges()
      .pipe(
        map((changes) => {
          // console.log('fecth fav list');
          return changes.map((c) => c.payload.key);
        })
      )
      .subscribe((res) => {
        // console.log('fecth fav list');
        this.favourites = res;
        this.favs$.next(res);
      });
  }

  // to do: organise structure to include user<->recipe settings, could include favourites, as well as date last made, personal annotations, what else???
}
