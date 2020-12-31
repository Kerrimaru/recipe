import { Component, OnInit } from '@angular/core';
import { TagService } from '../tags.service';
import { Tag } from '../tag.model';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss'],
})
export class TagSelectorComponent implements OnInit {
  constructor(private tagService: TagService) {}
  userTag: string;
  tags: Tag[];

  ngOnInit() {
    this.tagService.fetchTags().subscribe((tags) => {
      this.tags = tags;
      console.log('tags: ', tags, this.tags);
    });
  }

  createTag() {
    console.log('user input: ', this.userTag);
    const tag = new Tag(this.userTag);
    console.log('new tag: ', tag);
    this.tagService.createTag(tag);
  }
}
