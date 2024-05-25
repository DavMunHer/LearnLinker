import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  standalone: true
})
export class TitleCasePipe implements PipeTransform {

  transform(value: string): string {
      if (!value)
          return '';
      const words = value.split(' ');
      const titlecasedWords = words.map((word) => {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      });

      return titlecasedWords.join(' ');
    }
}
