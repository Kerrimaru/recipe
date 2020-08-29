import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TagService } from 'src/app/tags/tags.service';
import { Tag } from 'src/app/tags/tag.model';

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

  test: any;
  tags: Tag[];

  public previewImagePath;
  imgURL: any;
  public message: string;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private dataService: DataStorageService,
    private tagService: TagService
  ) {}

  get ingredientControls() {
    // (<FormArray>this.recipeForm.get('ingredients')).controls;
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedRecipeId = +params['id'];
      this.editMode = !!params['id'];
      this.initForm();
      // this.tagService.fetchTags().subscribe((tags) => {
      //   this.tags = tags;
      //   console.log('tags: ', tags, this.tags);
      // });

      // const ele = document.querySelector('div[contenteditable]');
      // console.log('ele: ', ele);
      // ele.addEventListener('paste', function (e: any) {
      //   e.preventDefault();
      //   console.log('e: ', e);
      //   var text = e.clipboardData.getData('text/plain');
      //   var rich = e.clipboardData.getData('text/rtf');
      //   console.log('plain text: ', text);
      //   console.log('plain rich: ', rich);
      //   // document.execCommand('insertHTML', false, text);
      //   document.execCommand('insertHTML', false, text);
      // });
    });

    // this.recipeForm = new FormGroup({
    //   name: new FormControl('', []),
    //   description: new FormControl('', []),
    //   imagePath: new FormControl('', []),
    //   // ingredients: new FormArray({
    //   //   // ingredient: new FormGroup({
    //   //   //   name: new FormControl('', []),
    //   //   //   amount: new FormControl('', []),
    //   //   // }),
    //   // }),
    // });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.selectedRecipeId);
      console.log('recipe: ', recipe);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      this.previewImagePath = recipe.imagePath;
      if (recipe.ingredients.length) {
        for (const ing of recipe.ingredients) {
          console.log('ing: ', ing);
          if (!!ing) {
            recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ing.name),
                // amount: new FormControl(ing.amount, Validators.required),
              })
            );
          }
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });

    this.onAddIngredient();
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
    const ingArr = _ing.value.filter((i) => !!i.name);
    const _recipe = { ...this.recipeForm.value };
    // const _recipe = { ...this.recipeForm.value, ingredients: ingArr, tags: this.tags };
    console.log('rec on submit: ', _recipe);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.selectedRecipeId);
      this.dataService.editRecipe(recipe.id, _recipe);
      this.recipeService.updateRecipe(this.selectedRecipeId, _recipe);
    } else {
      this.recipeService.addRecipe(_recipe);
      // this.dataService.createRecipe(_recipe);
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

  preview(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.previewImagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      const imgCtrl = this.recipeForm.get('imagePath');
      imgCtrl.setValue(this.imgURL);
    };
  }

  checkIfLast(index: number) {
    const ing = this.recipeForm.get('ingredients') as FormArray;
    console.log(' i ', index, ' lenght: ', ing.controls.length);
    console.log('ing: ', ing.controls[index]);
    if (index + 1 === ing.controls.length && ing.controls[index].valid) {
      this.onAddIngredient();
    }
  }

  focus(index: number) {
    const ing = this.recipeForm.get('ingredients') as FormArray;
    console.log(' i ', index, ' lenght: ', ing.controls.length);
    console.log('ing: ', ing.controls[index]);
    if (index + 1 === ing.controls.length) {
      this.onAddIngredient();
    }
  }

  onPaste(e, index: number) {
    console.log('e: ', e);
    e.preventDefault();
    // get text representation of clipboard
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    const ingArray = text.split(/\n/);
    ingArray.filter((i) => !!i).forEach((i) => this.onAddIngredient(i));

    this.onRemoveIngredient(index);

    // insert text manually
    // document.execCommand('insertText', false, text);
    // this.

    // document.execCommand('insertHTML', false, text);
  }
}

// editor.addEventListener("paste", function(e) {
//   // cancel paste
//   e.preventDefault();

//   // get text representation of clipboard
//   var text = (e.originalEvent || e).clipboardData.getData('text/plain');

//   // insert text manually
//   document.execCommand("insertHTML", false, text);
// });
