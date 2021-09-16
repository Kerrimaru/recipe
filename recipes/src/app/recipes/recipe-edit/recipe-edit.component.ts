import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { NutritionConst, Recipe } from '../recipe.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { TagsConst } from 'src/app/shared/constants/tags.const';

interface Tag {
  name: string;
  selected: boolean;
}
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
  readOnly: boolean;

  test: any;
  tags: Tag[] = TagsConst;

  public previewImagePath;
  imgURL: any;
  public message: string;
  public Editor = ClassicEditor;
  ingredientsArrayRef: FormArray;
  tagsArrayRef: FormArray;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private auth: AuthService
  ) {}

  get ingredientControls() {
    return this.ingredientsArrayRef.controls;
  }

  ngOnInit(): void {
    this.readOnly = this.auth.readOnly.getValue();
    this.route.params.subscribe((params) => {
      this.selectedRecipeId = params['id'];
      this.editMode = !!params['id'];
      this.initForm();
    });
  }

  private initForm() {
    this.ingredientsArrayRef = new FormArray([]);

    if (this.editMode) {
      // this.recipe = this.recipeService.getRecipe(this.selectedRecipeId);
      this.recipe = this.recipeService.getRecipeByKey(this.selectedRecipeId);
      if (this.recipe.tags) {
        this.recipe.tags.forEach((t) => {
          const tag = this.tags.find((tag) => tag.name === t);
          if (tag) {
            tag.selected = true;
          }
        });
      }
      // if (!this.recipe.nutrition) {
      //   this.recipe.nutrition = [...NutritionConst];
      // }

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
      if (!this.readOnly) {
        this.recipe.addedBy = this.auth.user.value.name;
        this.recipe.userId = this.auth.user.value.id;
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(this.recipe.name, Validators.required),
      imagePath: new FormControl(this.recipe.imagePath, Validators.required),
      description: new FormControl(this.recipe.description, Validators.required),
      ingredients: this.ingredientsArrayRef,
    });

    this.onAddIngredient();
  }

  toggleTag(tag: Tag) {
    if (!this.recipeForm.dirty) {
      this.recipeForm.markAsDirty();
    }
    tag.selected = !tag.selected;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ingredientControls, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    if (!this.recipeForm.valid || this.readOnly) {
      return;
    }

    // remove empty ingredients and flatten obj
    const ingArr = this.ingredientsArrayRef.value.filter((i) => !!i.name).map((_i) => _i.name);
    const tagsList = this.tags.filter((t) => t.selected).map((t) => t.name);

    const _recipe = Object.assign(this.recipe, {
      ...this.recipeForm.value,
      ingredients: ingArr,
      tags: tagsList,
      // nutrition: this.recipe.nutrition
    });

    if (this.editMode) {
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
    // const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    // remove images/alt text
    // this is a bad gousto hack, until I can figure out how to remove images/alt text reliably
    const containsImages = e.clipboardData.getData('text/html').includes('<img');
    let text;
    let ingArray;
    if (!containsImages) {
      text = (e.originalEvent || e).clipboardData.getData('text/plain');
      ingArray = text.split(/\n/);
    } else {
      text = e.clipboardData.getData('text/html').replace(/<img[^>]*>/g, '\n');
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const bod = doc.getElementsByTagName('body')[0];
      ingArray = bod.innerText.split(/\n/);
    }

    // regular paste event
    if (ingArray.length === 1) {
      e.target.value += ingArray[0];
      return;
    }
    // or
    // paste list of ingredients
    ingArray.filter((i) => !!i).forEach((i) => this.onAddIngredient(i));

    this.onRemoveIngredient(index);
    // or :
    // const ingArraySet = new Set(text.split(/\n/));
    // console.log('ing arr: ', ingArraySet);
    // ingArraySet.forEach((i) => this.onAddIngredient(i));
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
          const dataurl = elem.toDataURL('image/jpeg', 0.8);
          observer.next(dataurl);
        }),
          (reader.onerror = (error) => observer.error(error));
      };
    });
  }
}
