import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setDate'
})
export class SetDatePipe implements PipeTransform {

  transform(input : string): string {
    let date = new Date(input);
    let d, m , y;
    d = date.getDate();
    m = date.getMonth() + 1;
    y = date.getFullYear();
    if (d < 10) {
      d = '0' + d;
    }
    if (m < 10) {
      m = '0' + m;
    }
    return d + '/' + m + '/' + y;
  }

}
