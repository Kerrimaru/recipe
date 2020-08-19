import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-empty-recipe',
  templateUrl: './empty-recipe.component.html',
  styleUrls: ['./empty-recipe.component.scss'],
})
export class EmptyRecipeComponent implements OnInit {
  constructor(private authService: AuthService) {}
  user: User;
  private userSub: Subscription;

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }
}
