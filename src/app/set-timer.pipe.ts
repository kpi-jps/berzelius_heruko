import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setTimer'
})
export class SetTimerPipe implements PipeTransform {
  //input em milissegundos
  transform(input : number): string {
    let t, m, s;
    t = input / 1000;//transformando em segundos
    m = Math.floor(t / 60);
    s = ((t / 60) - Math.floor(t / 60))*60
    if (m < 10) {
      m = '0' + m.toFixed(0);
    } else {
      m = m.toFixed(0);
    }
    if (s < 10) {
      s = '0' + s.toFixed(0);
    } else {
      s = s.toFixed(0);
    }
    
    return m + ':' + s;
  }

}
