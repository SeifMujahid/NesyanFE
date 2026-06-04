import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanDate',
  standalone: true,
})
export class CleanDatePipe implements PipeTransform {
  transform(value: string, type: number): string | void {
    if (type === 1) {
      const date = value.slice(0, 10);
      return date;
    }

    if (type === 2) {
      const dateTime = value.replace('T', ' - ');
      return dateTime;
    }
  }
}
