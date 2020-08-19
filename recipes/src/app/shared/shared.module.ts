import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading/loading.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoadingComponent, DropdownDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [LoadingComponent, DropdownDirective, CommonModule, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
