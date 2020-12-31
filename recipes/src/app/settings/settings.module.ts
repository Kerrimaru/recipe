import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    SharedModule,
    // FormsModule,
    RouterModule.forChild([{ path: '', component: SettingsComponent }]),
  ],
})
export class SettingsModule {}
