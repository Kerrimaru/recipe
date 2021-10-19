import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from '../../../environments/environment';
import { UserSettingsService } from 'src/app/settings/user-settings.service';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';

interface Note {
  id: string;
  note: string;
  userId: string;
  user: string;
  date: number;
  show: boolean; // show details
}

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Input() recipeInput: Recipe;

  recipe: Recipe;
  recipeKey: string;
  loading = false;
  recipes: any;

  user: User;
  showEdit = false;
  showDelete = !environment.production;
  isFavourite: boolean;
  toDoSelected: boolean;

  ingExpanded = true;
  methExpanded = true;

  datesMade: any[] = [];
  dateInput: any;

  notes: (Note | string)[] = [];

  readOnly: boolean;

  datesSub: Subscription;
  notesSub: Subscription;
  recSub: Subscription;

  @ViewChild('recipeRef', { static: false }) recipeElRef: ElementRef;
  @ViewChild('activeNoteRef') activeNoteRef;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private settingsService: UserSettingsService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user.getValue();
    this.readOnly = this.authService.readOnly.getValue();

    // this is disabled for now
    if (this.recipeInput) {
      this.recipe = this.recipeInput;
      this.showEdit = !environment.production || this.recipe.userId === this.user.id;
    } else {
      this.route.params.subscribe((params) => {
        // a cheat to allow only me to delete recipes, but do this properly at some point
        if (environment.production && this.user.id == 'RDN8uluhOqP8aATgV0QxF60yi2F2') {
          this.showDelete = true;
        }
        this.recipeKey = params['id'];
        this.recSub = this.recipeService
          .getRecipeSub(this.recipeKey)
          .pipe()
          .subscribe((r) => {
            if (!r) {
              this.loading = true;
              return;
            }
            this.recipe = r;
            // console.log('rec:', this.recipe);

            this.notesSub = this.recipeService
              .getNotesList(r.key)
              .snapshotChanges()
              .pipe(
                map((res) => {
                  this.notes = res
                    .map((note: any): Note => {
                      return { id: note.payload.key, ...note.payload.val(), show: false };
                    })
                    .reverse();
                })
              )
              .subscribe();

            // to do: subscribe properly
            this.datesSub = this.recipeService
              .getUserDates(this.user.id, r.key)
              .snapshotChanges()
              .pipe(
                map((res) => {
                  this.datesMade = res
                    .map((date) => {
                      return { date: date.payload.val(), id: date.key };
                    })
                    .sort()
                    .reverse();
                })
              )
              .subscribe();

            this.isFavourite = this.settingsService.favourites.includes(this.recipeKey);
            this.toDoSelected = this.settingsService.toDoIds.includes(this.recipeKey);
            this.showEdit = !environment.production || this.recipe.userId === this.user.id;
          });
      });
    }
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
    this.datesSub.unsubscribe();
    this.recSub.unsubscribe();
  }

  favourite() {
    this.isFavourite = !this.isFavourite;
    if (this.readOnly) {
      return;
    }
    this.settingsService.toggleFavourite(this.recipeKey);
  }

  toggleToDo() {
    this.toDoSelected = !this.toDoSelected;
    if (this.readOnly) {
      return;
    }
    this.settingsService.toggleToDo(this.recipeKey);
  }

  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe() {
    if (this.readOnly) {
      return;
    }
    this.showConfirm('recipe', 'This will permanently delete this recipe', 'Are you sure?', 'takeout-delete.png', [
      { text: 'Cancel', primary: true },
      { text: `Delete`, go: 'delete', danger: true },
    ]).subscribe((res) => {
      this.recipeService.deleteRecipeByKey(this.recipeKey).then((r) => {
        this.router.navigate(['/']);
      });
    });
  }

  onDateChange(event?) {
    if (this.readOnly) {
      return;
    }
    const timestamp = event ? event.getTime() : new Date().getTime();
    this.dateInput = null;
    this.recipeService.setUserDateMade(this.user.id, this.recipe.key, timestamp);
  }

  deleteDate(e) {
    // this confirm is really annoying and ugly
    this.showConfirm('date').subscribe((res) => {
      this.recipeService.deleteUserDateMade(this.user.id, this.recipe.key, e.id);
    });
  }

  onNoteSave(note) {
    if (!note.id) {
      const newNote = { note: note.text, userName: this.user.name, userId: this.user.id };
      this.recipeService.setNote(this.recipe.key, newNote);
    } else {
      this.recipeService.updateNote(note.text, note.id, this.recipe.key);
    }
  }

  onDeleteNote(noteId: string) {
    if (this.readOnly) {
      return;
    }
    this.showConfirm('note').subscribe((res) => {
      this.recipeService.deleteNote(noteId, this.recipe.key);
    });
  }

  showConfirm(type: string, lines?, title?: string, image?: string, actions?: any[]): Observable<any> {
    return this.dialog.alert({
      title: title,
      // lines: `This will permanently delete this ${type}`,
      lines: lines || `Delete this ${type}?`,
      actions: actions || [{ text: 'Delete', go: 'delete', danger: true }],
      image: image || 'takeout-delete.png',
    });
  }
}