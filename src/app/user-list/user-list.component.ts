import { Component, OnInit, Input } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { EventEmitter, Output } from '@angular/core';

import { User } from '../user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Input() activeUser: User; //recebe informações do usuário logado e ativo
  @Output() onDelUser = new EventEmitter<Object>();
  @Output() onEditUser = new EventEmitter<Object>();
  users : User [] = [];
  confirmMsg : string; //mensagem do confirm
  confirm : boolean = false; //controla a vizualizaçãao do modal de confirm
  empty : boolean = false; 
  userId : string; //armazena o id do usuário
  constructor(private userService: UserServiceService) { }
  
  getUsers() {
    this.userService.serviceGetUsers().subscribe(response => {
      if (response.length == 0) {
        this.empty = true;
      } else {
        //não adiciona o usuário adm logado.
        for(let i = 0; i < response.length; i++) {
          if (response[i]._id != this.activeUser._id) {
            this.users.push(response[i]);
          }
        }
      }
    });
  }

  initDel(user : User) {
    this.confirm = true;
    this.userId = user._id;
    this.confirmMsg = 'Tem certeza que deseja deletar o usuário: ' + user.name + ' ?';
  }
  cancelDel() {
    this.confirm = false;
  }
  onDel() {
    let msg : string = '';
    this.userService.serviceDeleteUser(this.userId).subscribe(res => {
      if(res.ok == true) {
        msg = 'Usuário deletado com sucesso!';
        this.onDelUser.emit({msg: msg, type: "success", del: true});
        this.confirm = false;
      } else {
        msg = 'Erro, o usuário não foi deletado!'
        this.onDelUser.emit({msg: msg, type: "error", del: false});
      }
    });
  }

  editUserStatus(user : User){
    let msg = '';
    let userData = {
      name:user.name,
      email:user.email,
      login: user.login,
      password: user.password,
      adm: false //já seta o usuário como não administrador
    }
    this.userId = user._id;
    //troca o status 
    if(user.adm) { 
      userData.adm = false;
    } else {
      userData.adm = true;
    }
    this.userService.serviceUpdateUser(userData, this.userId).subscribe(res => {
      if(res.ok == true) {
        msg = 'Status do usuário alterado com sucesso!';
        this.onEditUser.emit({msg: msg, type: "success", update: true});
        
      } else {
        msg = 'Erro, operação não realizada!';
        this.onEditUser.emit({msg: msg, type: "error", update: false});
      }
    });
    
  }

  ngOnInit(): void {
    this.getUsers();
  }

}
