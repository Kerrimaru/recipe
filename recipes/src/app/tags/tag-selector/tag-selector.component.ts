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
    });
  }

  createTag() {
    const tag = new Tag(this.userTag);
    this.tagService.createTag(tag);
  }
}
