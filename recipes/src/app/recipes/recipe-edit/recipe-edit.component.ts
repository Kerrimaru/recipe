import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TagService } from 'src/app/tags/tags.service';
import { Tag } from 'src/app/tags/tag.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthService } from 'src/app/auth/auth.service';
import { EMPTY, interval, Observable } from 'rxjs';
import { debounce, expand, map } from 'rxjs/operators';
import { uniq } from 'lodash';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  selectedRecipeId: number;
  editMode = false;
  recipeForm: FormGroup;
  fileToUpload: File = null;
  recipe = new Recipe();

  test: any;
  tags: any[];

  public previewImagePath;
  imgURL: any;
  public message: string;
  public Editor = ClassicEditor;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private dataService: DataStorageService,
    // private tagService: TagService
    private auth: AuthService
  ) {}

  get ingredientControls() {
    // (<FormArray>this.recipeForm.get('ingredients')).controls;
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    this.tags = ['the', 'cat', 'is', 'very', 'fast'];
    console.log(this.tags);
    this.route.params.subscribe((params) => {
      this.selectedRecipeId = +params['id'];
      this.editMode = !!params['id'];
      this.initForm();
      // this.tagService.fetchTags().subscribe((tags) => {
      //   this.tags = tags;
      //   console.log('tags: ', tags, this.tags);
      // });
    });

    this.recipeForm
      .get('name')
      .valueChanges.pipe(
        // map(change => {

        // }),
        debounce((change) => interval(500))
      )
      .subscribe((res) => {
        console.log('tiile after deoubnce: ', res);
        // this.recipeForm.get('name').setValue(this.formatTitle(res), { emitEvent: false });
        this.recipeForm.get('name').setValue(res, { emitEvent: false });
        // this.createTags(res);
      });
  }

  private initForm() {
    // let recipeName = '';
    // let recipeImagePath = '';
    // let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.recipe = this.recipeService.getRecipe(this.selectedRecipeId);
      // recipeName = recipe.name;
      // recipeImagePath = recipe.imagePath;
      // recipeDescription = recipe.description;
      this.previewImagePath = this.recipe.imagePath;
      if (this.recipe.ingredients.length) {
        for (const ing of this.recipe.ingredients) {
          if (!!ing) {
            recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ing),
              })
            );
          }
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(this.recipe.name, Validators.required),
      imagePath: new FormControl(this.recipe.imagePath, Validators.required),
      description: new FormControl(this.recipe.description, Validators.required),
      // name: new FormControl(recipeName, Validators.required),
      // imagePath: new FormControl(recipeImagePath, Validators.required),
      // description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });

    this.onAddIngredient();
    console.log('this rcipe: ', this.recipe);
  }

  formatTitle(text: string) {
    const array = text.split(' ');
    for (let i = 0; i < array.length; i++) {
      const word = array[i];
      console.log('index: ', i);
      console.log('word: ', word);
      if (this.isJoiningWord(word) && i !== 0) {
        array[i] = word.toLowerCase();
      } else {
        array[i] = word[0].toUpperCase() + word.substr(1).toLowerCase();
      }
    }

    return array.join(' ');
  }

  createTag(word: string) {
    const _tag = word.toUpperCase();
    if (!this.tags.includes(_tag)) {
      this.tags.push(_tag);
    }
  }

  isJoiningWord(word: string): boolean {
    const words = ['of', 'the', 'is', 'and', 'on', 'by'];
    return words.includes(word.toLowerCase());
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.ingredientControls);
    moveItemInArray(this.ingredientControls, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    if (!this.recipeForm.valid) {
      console.log('not valid but why? ', this.recipeForm);
      return;
    }
    // remove empty ingredients
    const _ing = this.recipeForm.get('ingredients') as FormArray;
    const ingArr = _ing.value.filter((i) => !!i.name).map((_i) => _i.name);
    console.log('ing arr: ', ingArr);
    // const _recipe = { ...this.recipeForm.value };
    const _recipe = { ...this.recipeForm.value, ingredients: ingArr, tags: this.tags || null };

    if (this.editMode) {
      // const key = this.recipeService.getRecipe(this.selectedRecipeId);
      console.log('rec in edit mode: ', this.recipe.key);
      // this.dataService.editRecipe(recipe.id, _recipe);
      this.recipeService.updateRecipe(_recipe, this.recipe.key);
    } else {
      // this.recipe.addedBy = this.auth.user.value.name;
      // const _recipe = {
      //   ...this.recipeForm.value,
      //   addedBy: this.auth.user.value.name,
      //   favourite: false,
      //   created: moment().format(),
      // };
      // this.recipe = { ...this.recipeForm.value };
      const _rec = Object.assign(this.recipe, { ..._recipe, addedBy: this.auth.user.value.name, tags: null });

      console.log(this.recipe);
      // do not upload - testing only
      this.recipeService.addRecipe(_rec);
    }
    this.onCancel();
    // this.recipeForm.reset();
  }

  onAddIngredient(ingredient?: string) {
    // this.controls.push(
    //   new FormGroup({
    //     name: new FormControl(null, Validators.required),
    //     amount: new FormControl(null, Validators.required),
    //   })
    // );
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(ingredient ? ingredient : null),
        // amount: new FormControl(null, Validators.required),
        // amount: new FormControl(null),
      })
    );
  }

  onRemoveIngredient(index: number) {
    // (this.recipeForm.get('ingredients')).removeAt(index)
    // this.controls.removeAt(index)
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    console.log('file: ', event);
  }

  checkIfLast(index: number) {
    const ing = this.recipeForm.get('ingredients') as FormArray;
    if (index + 1 === ing.controls.length && ing.controls[index].valid) {
      this.onAddIngredient();
    }
  }

  focus(index: number) {
    const ing = this.recipeForm.get('ingredients') as FormArray;
    if (index + 1 === ing.controls.length) {
      this.onAddIngredient();
    }
  }

  onPaste(e, index: number) {
    e.preventDefault();
    // get text representation of clipboard
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    const ingArray = text.split(/\n/);
    ingArray.filter((i) => !!i).forEach((i) => this.onAddIngredient(i));

    this.onRemoveIngredient(index);
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) === null) {
      this.message = 'Only images are supported.';
      return;
    }
    this.compress(files[0]).subscribe((res) => {
      this.imgURL = res;
      const imgCtrl = this.recipeForm.get('imagePath');
      imgCtrl.setValue(res);
    });
  }

  compress(file: File): Observable<any> {
    const width = 600; // For scaling relative to width
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return Observable.create((observer) => {
      reader.onload = (ev) => {
        const img = new Image();
        img.src = (ev.target as any).result;
        (img.onload = () => {
          const elem = document.createElement('canvas') as HTMLCanvasElement; // Use Angular's Renderer2 method
          const scaleFactor = width / img.width;
          elem.width = width;
          elem.height = img.height * scaleFactor;
          const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
          ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
          const dataurl = elem.toDataURL('image/jpeg', 0.3);
          observer.next(dataurl);
        }),
          (reader.onerror = (error) => observer.error(error));
      };
    });
  }
}
