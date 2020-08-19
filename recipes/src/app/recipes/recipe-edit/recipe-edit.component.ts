import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';

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

  public previewImagePath;
  imgURL: any;
  public message: string;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private dataService: DataStorageService
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
      console.log('edit mode ', recipe);
      console.log('recipe: ', recipe);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      console.log(this.previewImagePath, recipe.imagePath);
      this.previewImagePath = recipe.imagePath;
      if (recipe.ingredients.length) {
        console.log('ingredients ', recipe.ingredients);
        for (let ing of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ing.name, Validators.required),
              amount: new FormControl(ing.amount, Validators.required),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      test: new FormControl(''),
      ingredients: recipeIngredients,
    });

    this.onAddIngredient();
  }

  onSubmit() {
    console.log('val: ', this.recipeForm.value);

    if (!this.recipeForm.valid) {
      console.log('not valid but why? ', this.recipeForm);
      return;
    }
    if (this.editMode) {
      this.recipeService.updateRecipe(this.selectedRecipeId, this.recipeForm.value);
      this.onCancel();
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
      // this.dataService.createRecipe(this.recipeForm.value);
      // this.router.navigate(['..'], { relativeTo: this.route });
    }

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
        name: new FormControl(ingredient ? ingredient : null, Validators.required),
        // amount: new FormControl(null, Validators.required),
        amount: new FormControl(null),
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

  testIng() {
    console.log(this.test);
    console.log(this.recipeForm.controls.test.value);
    const elem = document.getElementById('testel');
    console.log('tesetl', elem);
    console.log('elem.textContent ', elem.textContent);
    console.log('elem.innerHTML ', elem.innerHTML);
    console.log('elem.innerText ', elem.innerText);
  }

  onPaste(e) {
    console.log('e: ', e);

    e.preventDefault();
    console.log('e: ', (e.originalEvent || e).clipboardData.getData('text/richtext'));
    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    const split = text.split(/\n/);
    split.forEach((i) => {
      this.onAddIngredient(i);
    });
    console.log('split: ', split);
    console.log('text: ', text.trim());

    // insert text manually
    document.execCommand('insertText', false, text);
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
