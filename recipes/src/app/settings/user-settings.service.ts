import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
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
  // favouritesList: AngularFireList<string>;
  userSettingsRef: any;
  favsRef: any;

  recTest: Observable<any[]>;

  // to do: make this key value pairs and update correctly
  toggleFavourite(recipeId: string, isFavourite: boolean) {
    const _favs = this.favourites.includes(recipeId)
      ? this.favourites.filter((id) => id !== recipeId)
      : [...this.favourites, recipeId];
    console.log('this favs: ', this.favourites, recipeId, isFavourite);
    // if (!isFavourite) {
    //   // this.favourites.remove90; remove from favs
    // } else {
    //   // this.favourites.push(recipeId);
    //   this.favsRef.set([...this.favourites, recipeId]);
    // }
    console.log(_favs);
    this.favsRef.set(_favs);
    // to do
    // this.favouritesList.update(favId, { recipeId });
    console.log('this favs: ', this.favourites);
  }

  setDiet(userId: string, diet: string) {
    // set diet
  }

  setTheme(userId: string, theme: string) {
    // set theme
  }

  saveChanges(userId) {
    // this.fb.database.ref
    const settings = { diet: 'vegan', favourites: [], theme: 'default' };
    this.fb.database.ref('userSettings/' + userId).set(settings);

    // this.userSettings.push(settings);
  }

  getFavourites(userId) {
    this.favsRef = this.fb.database.ref(`userSettings/${userId}/favourites`);
    this.favsRef.on('value', (snapshot) => {
      this.favourites = snapshot.val() || [];
      console.log('this.favourites: ', this.favourites, ' vel: ', snapshot.val());
    });
  }

  fetchUserSettings(userId) {
    this.userSettingsRef = this.fb.database.ref(`userSettings/${userId}`);
    this.userSettingsRef.once('value').then((snapshot) => {
      this.userSettings = snapshot.val();
      this.getFavourites(userId);
    });
  }
}
