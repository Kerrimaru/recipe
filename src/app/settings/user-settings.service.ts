// import { Reference } from "@angular/compiler/src/render3/r3_ast";
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { take } from 'rxjs/operators';
import { UserSettings } from '../auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(
    private fb: AngularFireDatabase,
    public fbAuth: AngularFireAuth
  ) {}
  userSettings: any;

  favourites: string[];
  favouritesList: AngularFireList<string>;
  favs$ = new BehaviorSubject<string[]>([]);

  filters: string[] = [];
  filtersChanged = new Subject<string[]>();

  userSettingsRef: firebase.default.database.Reference;
  favsRef: firebase.default.database.Reference;

  toDoList: AngularFireList<string>;
  toDoIds: string[];
  toDo$ = new BehaviorSubject<string[]>([]);
  toDoRef: firebase.default.database.Reference;
  // toDo$ = new BehaviorSubject<string[]>([]);

  toggleFavourite(recipeKey: string) {
    this.favourites.includes(recipeKey)
      ? this.favsRef.child(recipeKey).remove()
      : this.favsRef.child(recipeKey).set(true);
  }

  toggleToDo(recipeKey: string) {
    this.toDoIds.includes(recipeKey)
      ? this.toDoRef.child(recipeKey).remove()
      : this.toDoRef.child(recipeKey).set(true);
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

  //   });
  // }

  fetchUserSettings(userId) {
    this.userSettingsRef = this.fb.database.ref(`userSettings/${userId}`);
    this.userSettingsRef.once('value').then((snapshot) => {
      this.userSettings = snapshot.val();
    });
  }

  fetchFavsList(userId): Subscription {
    this.favsRef = this.fb.database.ref(`userSettings/${userId}/favourites`);
    this.favouritesList = this.fb.list(`userSettings/${userId}/favourites`);
    return this.favouritesList
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => c.payload.key);
        }),
        take(1)
      )
      .subscribe((res) => {
        this.favourites = res;
        this.favs$.next(res);
      });
  }

  fetchToDoList(userId): Subscription {
    this.toDoRef = this.fb.database.ref(`userSettings/${userId}/toDo`);
    this.toDoList = this.fb.list(`userSettings/${userId}/toDo`);
    return this.toDoList
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => c.payload.key);
        }),
        take(1)
      )
      .subscribe((res) => {
        this.toDoIds = res;
        this.toDo$.next(res);
      });
  }

  setFilters(filter: string) {
    this.filters.push(filter);
    this.filtersChanged.next(this.filters.slice());
  }

  fetchFilters() {}

  getFilters() {
    return this.filters.slice();
  }

  // to do: organise structure to include user<->recipe settings, could include favourites, as well as date last made, personal annotations, what else???
}
