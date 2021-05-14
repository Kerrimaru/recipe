import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeWhile, map, tap } from 'rxjs/operators';
import { Tag } from './tag.model';
import { Subject } from 'rxjs';

// tags not yet developed
@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private http: HttpClient) {}

  tagsChanged = new Subject<Tag[]>();

  private tags: Tag[] = [];

  setTags(tags: Tag[]) {
    this.tags = tags;
    if (!this.tags) {
      this.tags = [];
    }
    this.tagsChanged.next(this.tags.slice());
  }

  createTag(tag: Tag) {
    this.http.post('https://kerr-recipe.firebaseio.com/tags.json', tag).subscribe((res) => {
      if (!this.tags) {
        this.tags = [];
      }
      this.tags.push(tag);
      this.tagsChanged.next(this.tags.slice());
    });
  }

  fetchTags() {
    return this.http.get('https://kerr-recipe.firebaseio.com/tags.json').pipe(
      takeWhile((tags) => !!tags),
      map((tags) => {
        return Object.entries(tags).map((e) => {
          return Object.assign(e[1], { id: e[0] });
        });
      }),
      tap((tags) => {
        this.setTags(tags);
        return tags;
      })
    );
  }

  getTags() {
    return this.tags.slice();
  }
}
