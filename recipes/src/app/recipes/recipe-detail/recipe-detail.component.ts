import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from '../../../environments/environment';
import { UserSettingsService } from 'src/app/settings/user-settings.service';
import { map } from 'rxjs/operators';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit, AfterViewInit {
  @Input() recipeInput: Recipe;

  recipe: Recipe;
  recipeKey: any;
  loading = false;
  recipes: any;
  recSub: any;
  user: any;
  userSub: any;
  showActions = false;
  isFavourite: boolean;
  datesMade: any[] = [];
  dateInput: any;
  notes = [];
  noteInput: any;
  notesSectionHidden = true;
  notesInputExpanded = false;

  @ViewChild('recipeRef', { static: false }) recipeElRef: ElementRef;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private settingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user.getValue();
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    // this is disabled for now
    if (this.recipeInput) {
      this.recipe = this.recipeInput;
      this.showActions = !environment.production || this.recipe.userId === this.user.userId;
    } else {
      this.route.params.subscribe((params) => {
        this.recipeKey = params['id'];
        this.recSub = this.recipeService
          .getRecipeSub(this.recipeKey)
          .pipe()
          .subscribe((r) => {
            if (!r) {
              this.loading = true;
            }
            this.recipe = r;
            console.log('reecipe: ', r);
            const notes2 = this.recipeService
              .getNotesList(r.key)
              .snapshotChanges()
              .pipe(
                map((res) => {
                  this.notes = res.map((r) => r.payload.val()).reverse();
                })
              )
              .subscribe();

            const dates = this.recipeService
              .getUserDates(this.user.id, r.key)
              .snapshotChanges()
              .pipe(
                map((res) => {
                  this.datesMade = res
                    .map((date) => date.payload.val())
                    .sort()
                    .reverse();
                })
              )
              .subscribe();

            // .subscribe((res) => (this.notes = res));
            this.isFavourite = this.settingsService.favourites.includes(this.recipeKey);
            this.showActions = !environment.production || this.recipe.userId === this.user.userId;
            // console.log('recipe: ', r);
          });
      });
    }
  }

  ngAfterViewInit() {
    // disabled?
    // console.log('el ref: ', this.recipeElRef);
    // if (this.recipeElRef) {
    //   setTimeout(() => {
    //     window.scrollTo({
    //       top: this.recipeElRef.nativeElement.offsetTop - 100,
    //       left: 0,
    //       behavior: 'smooth',
    //     });
    //   }, 0o0);
    // }
  }

  favourite() {
    this.isFavourite = !this.isFavourite;
    this.settingsService.toggleFavourite(this.recipeKey);
  }

  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe() {
    window.alert('you fool! ive disabled delete for now until you implement a proper alert');
    // this.recipeService.deleteRecipeByKey(this.recipeKey);
    this.router.navigate(['/']);
  }

  showNotes() {
    this.notesSectionHidden = !this.notesSectionHidden;
  }

  onNoteChange(e) {
    // console.log('note change: ', e);
  }

  saveNote(e) {
    const note = this.noteInput;
    if (!note) {
      return;
    }
    this.recipeService.setNote(this.recipe.key, note, this.user.name);
    this.noteInput = null;
  }

  onDateChange(event) {
    const timestamp = event.getTime();
    this.dateInput = null;
    this.recipeService.setUserDateMade(this.user.id, this.recipe.key, timestamp);
  }
}
