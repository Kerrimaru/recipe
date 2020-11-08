import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FavouritesComponent } from './favourites.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FavouritesComponent],
  imports: [
    SharedModule,
    // FormsModule,
    RouterModule.forChild([{ path: '', component: FavouritesComponent }]),
  ],
})
export class FavouritesModule {}
