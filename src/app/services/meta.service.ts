import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private title: Title, private meta: Meta) {}

  updateTitle(title: string) {
    if (title) {
      this.title.setTitle(title);
    }
  }

  updateDescription(description: string) {
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }
  }

  updateKeywords(keywords: string) {
    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }
  }
}
