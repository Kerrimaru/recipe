import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSub: Subscription;
  recipeList: Observable<any[]>;

  constructor(
    public fbAuth: AngularFireAuth,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private fb: AngularFireDatabase // private fb: AngularFirestore
  ) {
    // this.recipeList = this.fb.list('recipes');
    // this.stuff = fb.database.ref().child('recipes');

    // const userSub = this.fbAuth.user.subscribe((res) => console.log('user? : ', res));
    // this.fbAuth.signInWithEmailAndPassword('kerri.maru@gmail.com', 'pass123').then((res) => {
    //   console.log('sign res: ', res);
    //   this.recipeList = fb.list<Recipe[]>('recipes').valueChanges();
    // });
    // if (this.fbAuth.currentUser) {
    //   console.log('this.fbAuth.currentUser ', this.fbAuth.currentUser);
    //   this.recipeList = fb.list('recipes').valueChanges();
    //   this.recipeList.subscribe((res) => {
    //     console.log(res);
    //     this.recipeService.setRecipes(res);
    //   });
    // }

    // this.recipeList = recipeList()

    console.log('recipeList: ', this.recipeList, 'val? ', this.recipeList);
    // const things = fb.collection('recipes').valueChanges();
    // things.subscribe(console.log);
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   let recRef = this.fb.database.ref(`/recipes`);
    //   console.log('recref: ', recRef);
    //   recRef.once('value', (snapshot) => {
    //     console.log('snap: ', snapshot, 'val: ', snapshot.val());
    //     let recInfo = snapshot.val() || {};
    //     const username = recInfo['name'];
    //     const addsnotes = [];
    //   });
    // }, 1000);

    // this.dataStorageService.fetchRecipes().subscribe();
    this.recipes = this.recipeService.getRecipes();
    this.recipesSub = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      console.log('recipes changed:', recipes);
      let recipeEdited = false;
      if (this.recipes.length === recipes.length) {
        recipeEdited = true;
      }
      this.recipes = recipes;
      if (!recipeEdited) {
        const index = recipes.length - 1;
        // this.router.navigate([index], { relativeTo: this.route });
      }
    });
  }

  ngOnDestroy() {
    this.recipesSub.unsubscribe();
  }
}
