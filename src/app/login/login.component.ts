import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: UserServiceService,
    private routes : Router,
    private location : Location

    ) { }
  //variáveis
  users : User[] = []; //armazena a lista de usuários cadastrados no sistema
  access : boolean = true; //controla a visualização do formulário de acesso
  register : boolean = false; //controla a visualização do formulário de registro
  formRegister : FormGroup; //controla o formuário de registro
  formAccess : FormGroup; //controla o formulário de acesso
  alert : boolean; //controla vizualização do "popUp" de alerta
  success : boolean; //indica se mensagem de sucesso
  error : boolean; //indica se mensagem de erro
  msg : string; //mensagem apresentada por alertas
  
  //definindo os placeholders do formulários
  namePlaceHolder : string = 'Nome';
  emailPlaceHolder : string = 'email@email.com';
  loginPlaceHolder : string = 'Login';
  passwdPlaceHolder : string = '********';

  //ativa a vizualização do formulário de registro
  activeRegister() : void {
    this.access = false;
    this.register = true;
  }
  //ativa a vizualização do formulário de acesso
  activeAccess() : void {
    this.access = true;
    this.register = false;
  }
  
  //inicia o formulário de acesso
  private initFormAccess() : void {
    this.formAccess = new FormGroup({
      loginAccess : new FormControl(null, [Validators.required]),
      passwdAccess : new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  //inicia o formulário de registro
  private initFormRegister() : void {
    this.formRegister = new FormGroup({
      nameRegister : new FormControl(null, [Validators.required]),
      emailRegister : new FormControl(null, [Validators.required, Validators.email]),
      loginRegister : new FormControl(null, [Validators.required]),
      passwdRegister : new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }
  
  onSubmitAccess() : void {
    let msg = '';
    if(this.formAccess.get('loginAccess').valid && this.formAccess.get('passwdAccess').valid) {
      let userId : string; //id do usuário na banco de dados de usuários
      let check : boolean = false; //variável que checa se senha usuário existe no banco de dados (considera inicialmente que usuário não existe - false)
      let access = { //variável de acesso
        login:this.formAccess.get('loginAccess').value,
        password:this.formAccess.get('passwdAccess').value
      }
      this.userService.serviceGetUsers().subscribe(response => {
        this.users = response;
        if (response.length == 0) {
          msg = 'Não há usuários cadastrados!'
          this.triggerAlert(msg, "error"); //dispara alerta
          setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
        } else {
          let i = 0;
          while(i < this.users.length) {
            if(this.users[i].login == access.login ) {
              check = true;
              userId = this.users[i]._id;
            }
            i++;
          }
          if(check) { //se login encontrado testa a senha
            this.userService.serviceGetAccess(access, userId).subscribe(res => {
              //console.log(res);
              if(res.body.access && res.body.adm) {
                //console.log("acesso concedido - usuário adm");
                this.routes.navigate(["/adm-dashboard/" + userId]);

              } else if (res.body.access && !res.body.adm) {
                //console.log("acesso concedido - usuário não adm");
                this.routes.navigate(["/user-dashboard/" + userId]);
              } else {
                msg = 'Acesso negado! Senha incorreta!'
                this.triggerAlert(msg, "error"); //dispara alerta
                setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
              }
            });
          } else {
            msg = 'Usuário não encontrado!'
            this.triggerAlert(msg, "error"); //dispara alerta
            setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
          }
        }        
      });
    } else {
      msg = '';
      if(!this.formAccess.get('loginAccess').valid){
        msg += 'Campo "login" não preenchido! ';
      } 
      if(!this.formAccess.get('passwdAccess').valid) {
        msg += 'Campo "senha" não preenchido ou contendo menos de 8 caracteres!';
      }
      this.triggerAlert(msg, "error"); //dispara alerta
      setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }
    
  }

  onSubmitRegister() : void {
    let msg = '';
    if(this.formRegister.get('nameRegister').valid && this.formRegister.get('emailRegister').valid && this.formRegister.get('loginRegister').valid && this.formRegister.get('passwdRegister').valid) {
      let user = {
        name:this.formRegister.get('nameRegister').value,
        email:this.formRegister.get('emailRegister').value,
        login: this.formRegister.get('loginRegister').value,
        password: this.formRegister.get('passwdRegister').value,
        adm: false //já seta o usuário como não administrador
      }
      //checa se já existem usuários cadastrados
      this.userService.serviceGetUsers().subscribe(response => {
        this.users = response;
        //checa se cadastro é vázio se sim seta o primeiro usuário cadastrado como 
        //admimistrador do sistema
        if (response.length == 0) { 
          user.adm = true; //setando usuário como administrador
          console.log(user);
          //registra usuário
          this.registerUser(user);
        } else { //se não for vazio executa esse bloco
          //chacando se login já existe
          let i = 0;
          let check = false; //assume que login inicialmente não existe
          while (i < this.users.length) {
            if(this.users[i].login == user.login) {
              check = true; //se existe
            }
            i++;
          }
          if (check) { //se login existe executa isso
            msg = 'Login já cadastrado, selecione outro!'
            this.triggerAlert(msg, "error"); //dispara alerta
            setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
          } else { //se não existe executa isso
            //registra usuário
            this.registerUser(user);
          }
        }
      }) 
    } else { //se formulário não é válido
      msg = '';
      if(!this.formRegister.get('nameRegister').valid){
        msg += 'Campo "nome" não preenchido! ';
      } 
      if(!this.formRegister.get('emailRegister').valid) {
        msg += 'Campo "email" não preenchido ou com formato inválido! ';
      }
      if(!this.formRegister.get('loginRegister').valid) {
        msg += 'Campo "login" não preenchido! ';
      } 
      if(!this.formRegister.get('passwdRegister').valid) {
        msg += 'Campo "senha" não preenchido ou contendo menos de 8 caracteres!';
      }
      this.triggerAlert(msg, "error"); //dispara alerta
      setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }
  }
  //fecha o "popUp" de alerta
  closeAlert() : void {
    this.alert = false;
    this.success = false;
    this.error = false;
    this.msg = '';
  }
  //apresenta um popUp de alerta, onde "msg" é a mensagem apresentada pelo mesmo
  // e "type" é tipo de alerta, que pode receber o valor de "error" para erros e
  //"success" para sucesso
  triggerAlert(msg : string, type : string) : void {
    this.msg = msg;
    this.alert = true;
    if(type == "error") {
      this.error = true;
      this.success = false;
    } else if (type == "success") {
      this.error = false;
      this.success = true;
    }
  }
  //registra usuário no banco de dados.
  registerUser(user) : void {
    //registra usuário
    let msg;
    this.userService.serviceRegisterUser(user).subscribe(res => {
      if(res.ok == true) {
        msg = 'Usuário registrado com sucesso!';
        this.triggerAlert(msg, "success"); //dispara alerta
        setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
        this.initFormRegister();//inicia novamente o formulário de registro
        this.activeAccess(); //ativa o formulário de acesso acesso
        
      } else {
        msg = 'Erro, o usuário não foi salvo!'
        this.triggerAlert(msg, "error"); //dispara alerta
        setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
      }
    });
  }

  ngOnInit(): void {
    //inicializa o os formulários com a inicialização do componente
    this.initFormAccess();
    this.initFormRegister(); 
  }

}
