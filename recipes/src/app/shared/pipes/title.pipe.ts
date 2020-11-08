import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title',
})
export class TitlePipe implements PipeTransform {
  transform(input: string): string {
    // console.log('input: ', input);
    const words = input.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      // if (this.isJoiningWord(word)) {
      //   return null;
      // } else {
      //   return word;
      // }
      if (this.isJoiningWord(word) && i !== 0) {
        words[i] = word.toLowerCase() + ' ';
      } else {
        words[i] = this.makeCamelCase(word);
      }
    }
    // console.log('words: ', words);
    return words.join(' ');
  }

  private isJoiningWord(word: string): boolean {
    const words = ['of', 'the', 'is', 'and', 'on', 'by', 'with', 'and', 'au', 'le', 'les', 'la', 'in'];
    return words.includes(word.toLowerCase());
  }

  private makeCamelCase(word: string): string {
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
