import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setNum'
})
export class SetNumPipe implements PipeTransform {

  transform(input: number): string {
    return input.toFixed(1);
  }

}
