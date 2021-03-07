import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from '../../../environments/environment';
import { UserSettingsService } from 'src/app/settings/user-settings.service';
import { map } from 'rxjs/operators';
import { MatAccordion } from '@angular/material/expansion';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { Observable } from 'rxjs';

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
export class RecipeDetailComponent implements OnInit, AfterViewInit {
  @Input() recipeInput: Recipe;

  recipe: Recipe;
  recipeKey: any;
  loading = false;
  recipes: any;
  recSub: any;
  user: any;
  userSub: any;
  showEdit = false;
  showDelete = !environment.production;
  isFavourite: boolean;
  ingExpanded = true;
  methExpanded = true;

  datesMade: any[] = [];
  dateInput: any;

  notes: Note[] = [];
  noteInput: string;
  editNoteIndex: number;
  readOnly: boolean;

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

    // console.log('user: ', this.user);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    // this is disabled for now
    if (this.recipeInput) {
      this.recipe = this.recipeInput;
      this.showEdit = !environment.production || this.recipe.userId === this.user.id;
    } else {
      this.route.params.subscribe((params) => {
        if (environment.production && this.user.id == 'RDN8uluhOqP8aATgV0QxF60yi2F2') {
          // cheat to allow me to delete recipes, do this properly at some point
          this.showEdit = true;
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
            // console.log('reecipe: ', r);

            // to do: subscribe properly
            const notes2 = this.recipeService
              .getNotesList(r.key)
              .snapshotChanges()
              .pipe(
                map((res) => {
                  // console.log('notes res: ', res);
                  this.notes = res
                    .map(
                      (note: any): Note => {
                        // console.log('payload val: ', note.payload.val());
                        return { id: note.payload.key, ...note.payload.val() };
                      }
                    )
                    .reverse();
                  // console.log('note list?: ', this.notes);
                })
              )
              .subscribe();

            // to do: subscribe properly
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

            this.isFavourite = this.settingsService.favourites.includes(this.recipeKey);
            this.showEdit = !environment.production || this.recipe.userId === this.user.id;
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
    if (this.readOnly) {
      return;
    }
    this.settingsService.toggleFavourite(this.recipeKey);
  }

  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe() {
    if (this.readOnly) {
      return;
    }
    this.showConfirm('recipe').subscribe((res) => {
      console.log('confirm res: ', res);
      this.recipeService.deleteRecipeByKey(this.recipeKey).then((r) => {
        this.router.navigate(['/']);
      });
    });
    // window.alert('you fool! ive disabled delete for now until you implement a proper alert');
    // // this.recipeService.deleteRecipeByKey(this.recipeKey);
    // this.router.navigate(['/']);
  }

  onNoteChange(e) {
    // console.log('note change: ', e);
  }

  editNote(index: number, ref?: HTMLElement) {
    // console.log('ref: ', ref);
    if (ref) {
      ref.focus();
      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    }

    // console.log('edit note ,', index);
    this.editNoteIndex = index;
  }
  noclickpls() {
    console.log('doh!!!!!');
  }

  deleteNote(noteId: string) {
    if (this.readOnly) {
      return;
    }
    this.showConfirm('note').subscribe((res) => {
      console.log('confirm res: ', res);
      this.recipeService.deleteNote(noteId, this.recipe.key);
    });
  }

  deleteDate(e) {
    this.showConfirm('date').subscribe((res) => {
      console.log('confirm res: ', res);
      // this.recipeService.deleteNote(noteId, this.recipe.key);
    });
    // console.log('delte Date, ', e);
  }

  saveNote(e: HTMLElement, note?: Note) {
    e.blur();
    this.editNoteIndex = null;
    const newNote = e.innerHTML;
    if (!newNote || (!!note && newNote === note.note) || this.readOnly) {
      return;
    }
    if (note) {
      this.recipeService.updateNote(newNote, note.id, this.recipe.key);

      return;
    } else {
      this.recipeService.setNote(this.recipe.key, newNote, this.user.name, this.user.id);
      this.noteInput = null;
      e.innerHTML = '';
    }
  }

  onDateChange(event) {
    if (this.readOnly) {
      return;
    }
    const timestamp = event.getTime();
    this.dateInput = null;
    this.recipeService.setUserDateMade(this.user.id, this.recipe.key, timestamp);
  }

  showConfirm(type: string): Observable<any> {
    const actions: any = [
      { text: `Delete`, go: 'delete', primary: true },
      { text: 'Cancel', secondary: true },
    ];

    return this.dialog.simple({
      title: 'Are you sure?',
      lines: `This will permanently delete this ${type}`,
      actions: actions,
    });
  }
}
