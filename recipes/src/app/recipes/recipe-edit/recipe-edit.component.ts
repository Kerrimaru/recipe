import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
// import { DataStorageService } from 'src/app/shared/data-storage.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { TagService } from 'src/app/tags/tags.service';
// import { Tag } from 'src/app/tags/tag.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  selectedRecipeId: string;
  editMode = false;
  recipeForm: FormGroup;
  fileToUpload: File = null;
  recipe: Recipe;

  test: any;
  tags: any[];

  public previewImagePath;
  imgURL: any;
  public message: string;
  public Editor = ClassicEditor;
  ingredientsArrayRef: FormArray;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    // private dataService: DataStorageService,
    // private tagService: TagService
    private auth: AuthService
  ) {}

  get ingredientControls() {
    // (<FormArray>this.recipeForm.get('ingredients')).controls;
    // return (this.recipeForm.get('ingredients') as FormArray).controls;
    return this.ingredientsArrayRef.controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedRecipeId = params['id'];
      this.editMode = !!params['id'];
      this.initForm();
      // this.tagService.fetchTags().subscribe((tags) => {
      //   this.tags = tags;
      //   console.log('tags: ', tags, this.tags);
      // });
    });
  }

  private initForm() {
    this.ingredientsArrayRef = new FormArray([]);

    if (this.editMode) {
      // this.recipe = this.recipeService.getRecipe(this.selectedRecipeId);
      this.recipe = this.recipeService.getRecipeByKey(this.selectedRecipeId);
      this.previewImagePath = this.recipe.imagePath;
      if (this.recipe.ingredients && this.recipe.ingredients.length) {
        for (const ing of this.recipe.ingredients) {
          if (!!ing) {
            this.onAddIngredient(ing);
          }
        }
      }
    } else {
      this.recipe = new Recipe();
      this.recipe.addedBy = this.auth.user.value.name;
      this.recipe.userId = this.auth.user.value.id;
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(this.recipe.name, Validators.required),
      imagePath: new FormControl(this.recipe.imagePath, Validators.required),
      description: new FormControl(this.recipe.description, Validators.required),
      ingredients: this.ingredientsArrayRef,
    });

    this.onAddIngredient();
  }

  // there is really no need, just use a pipe?
  formatTitle() {
    const nameRef = this.recipeForm.get('name');
    const array = nameRef.value.split(' ');
    for (let i = 0; i < array.length; i++) {
      const word = array[i];
      if (this.isJoiningWord(word) && i !== 0) {
        array[i] = word.toLowerCase();
      } else {
        array[i] = word[0].toUpperCase() + word.substr(1).toLowerCase();
      }
    }
    nameRef.setValue(array.join(' '));
  }

  createTag(word: string) {
    const _tag = word.toUpperCase();
    if (!this.tags.includes(_tag)) {
      this.tags.push(_tag);
    }
  }

  isJoiningWord(word: string): boolean {
    if (word.length <= 2) {
      return true;
    }
    const words = ['the', 'and'];
    return words.includes(word.toLowerCase());
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.ingredientControls);
    moveItemInArray(this.ingredientControls, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    if (!this.recipeForm.valid) {
      console.log('form not valid ', this.recipeForm);
      return;
    }

    // remove empty ingredients and flatten obj
    const ingArr = this.ingredientsArrayRef.value.filter((i) => !!i.name).map((_i) => _i.name);

    const _recipe = Object.assign(this.recipe, {
      ...this.recipeForm.value,
      ingredients: ingArr,
      tags: this.tags || null,
    });
    console.log('_recipe: ', _recipe);
    if (this.editMode) {
      // const key = this.recipeService.getRecipe(this.selectedRecipeId);
      // this.dataService.editRecipe(recipe.id, _recipe);
      this.recipeService.updateRecipe(_recipe, this.recipe.key);
      this.onCancel();
    } else {
      const key = this.recipeService.addRecipe(_recipe);
      this.router.navigate(['recipes', key]);
    }
  }

  onAddIngredient(ingredient?: string) {
    // leave as form group in case I decide to add ingredient amount again, or other details in future
    this.ingredientsArrayRef.push(
      new FormGroup({
        name: new FormControl(ingredient ? ingredient : null),
      })
    );
  }

  onRemoveIngredient(index: number) {
    this.ingredientsArrayRef.removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    console.log('file: ', event);
  }

  checkIfLast(index: number) {
    if (index + 1 === this.ingredientsArrayRef.controls.length && this.ingredientsArrayRef.controls[index].valid) {
      this.onAddIngredient();
    }
  }

  focus(index: number) {
    if (index + 1 === this.ingredientsArrayRef.controls.length) {
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
