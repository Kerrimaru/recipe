import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading/loading.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [LoadingComponent, DropdownDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatTabsModule],
  exports: [
    LoadingComponent,
    DropdownDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTabsModule,
  ],
})
export class SharedModule {}
