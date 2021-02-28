import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User, UserSettings } from '../auth/user.model';
import { UserSettingsService } from './user-settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  accountDetailsForm: FormGroup;
  userSettingsForm: FormGroup;
  userSettings: UserSettings;
  user: User;
  userSub: Subscription;

  dietOptions = ['Vegan', 'Vegetarian', 'All'];
  themeOptions = [
    { name: 'vanilla', img: '', desc: '' },
    { name: 'artichoke', img: '', desc: '' },
    { name: 'asparagus', img: '', desc: '' },
    { name: 'blueberry', img: '', desc: '' },
    { name: 'citrus', img: '', desc: '' },
    { name: 'smore', img: '', desc: '' },
    { name: 'spice', img: '', desc: '' },
    { name: 'marshmallow', img: '', desc: '' },
    { name: 'watermelon', img: '', desc: '' },
    // {name: '', img: '', desc: ''},
  ];

  selectedDiet: string;
  selectedTheme = 'vanilla';

  constructor(private authService: AuthService, private settingsService: UserSettingsService) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;

        this.initForms();
        // this.isAuth = !!user;
      }
    });
  }

  private initForms() {
    this.accountDetailsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });

    this.userSettingsForm = new FormGroup({
      selectedDiet: new FormControl('', Validators.required),
      theme: new FormControl('', Validators.required),
    });
  }

  onChange(e) {
    // this.isChecked = !this.isChecked;
    this.selectedDiet = e.target.name;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  selectTheme(theme: string) {
    document.documentElement.className = 'theme-' + theme;
  }

  saveTest() {
    this.settingsService.saveChanges(this.user.id);
  }
}
