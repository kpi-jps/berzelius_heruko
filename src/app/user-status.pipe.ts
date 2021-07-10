import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {

  transform(input : boolean ): string {
    if (input) {
      return "Administrador";
    } else {
      return "Usuário";
    }
    
  }

}
