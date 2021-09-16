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

  noteActive = false;
  editNoteIndex: number;
  readOnly: boolean;

  datesSub: Subscription;
  notesSub: Subscription;
  recSub: Subscription;

  @ViewChild('recipeRef', { static: false }) recipeElRef: ElementRef;

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
            console.log('rec:' , this.recipe)

            this.notesSub = this.recipeService
              .getNotesList(r.key)
              .snapshotChanges()
              .pipe(
                map((res) => {
                  this.notes = res
                    .map((note: any): Note => {
                      return { id: note.payload.key, ...note.payload.val() };
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

  toDo() {
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
    this.showConfirm('recipe', 'Are you sure?').subscribe((res) => {
      this.recipeService.deleteRecipeByKey(this.recipeKey).then((r) => {
        this.router.navigate(['/']);
      });
    });
    // window.alert('you fool! ive disabled delete for now until you implement a proper alert');
    // // this.recipeService.deleteRecipeByKey(this.recipeKey);
    // this.router.navigate(['/']);
  }

  editNote(index: number, ref?: HTMLElement) {
    if (ref) {
      ref.focus();
      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    }

    this.editNoteIndex = index;
  }
  noclickpls() {
    // console.log('doh!!!!!');
  }

  deleteNote(noteId: string) {
    if (this.readOnly) {
      return;
    }
    this.showConfirm('note').subscribe((res) => {
      this.recipeService.deleteNote(noteId, this.recipe.key);
    });
  }

  deleteDate(e) {
    // this confirm is really annoying and ugly
    this.showConfirm('date').subscribe((res) => {
      this.recipeService.deleteUserDateMade(this.user.id, this.recipe.key, e.id);
    });
  }

  saveNote(el: HTMLElement, note?: Note | string) {
    el.blur();
    this.noteActive = false;
    this.editNoteIndex = null;
    const newNote = el.innerHTML;

    // empty note or guest note or  no changes to edited note
    if (!newNote || typeof note === 'string' || (!!note && newNote === note.note)) {
      return;
    }
    if (note) {
      this.recipeService.updateNote(newNote, note.id, this.recipe.key);
      return;
    } else {
      const newNote = { note: el.innerHTML, userName: this.user.name, userId: this.user.id };
      this.readOnly ? this.notes.push(newNote.note) : this.recipeService.setNote(this.recipe.key, newNote);

      el.innerHTML = '';
    }
  }

  onDateChange(event?) {
    if (this.readOnly) {
      return;
    }
    const timestamp = event ? event.getTime() : new Date().getTime();
    // window.alert('time: ' + timestamp);
    // return
    this.dateInput = null;
    this.recipeService.setUserDateMade(this.user.id, this.recipe.key, timestamp);
  }

  showConfirm(type: string, title?: string): Observable<any> {
    const actions: any = [
      { text: 'Cancel', primary: true },
      { text: `Delete`, go: 'delete', danger: true },
    ];

    return this.dialog.alert({
      title: title,
      lines: `This will permanently delete this ${type}`,
      actions: actions,
    });
  }
}
