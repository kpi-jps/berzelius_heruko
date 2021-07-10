import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserServiceService } from '../user-service.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-adm-dashboard',
  templateUrl: './adm-dashboard.component.html',
  styleUrls: ['./adm-dashboard.component.css']
})
export class AdmDashboardComponent implements OnInit {

  user : User;
  userInfo : boolean = false; //controla a visualização das informações do adm
  productRegister : boolean = false; //controla a visualização do formulário de registro de produto
  productsList : boolean = false; //controla a visualização da lista de produtos
  userList : boolean = false; //controla a visualização de lista de usuários
  orderList : boolean = false; //controla a visualização de lista de pedidos
  alert : boolean; //controla vizualização do "popUp" de alerta
  success : boolean; //indica se mensagem de sucesso
  error : boolean; //indica se mensagem de erro
  msg : string; //mensagem apresentada por alertas

  
  constructor(
    private userService: UserServiceService,
    private route : ActivatedRoute,
    private routes : Router

    ) { }
    onTimeOff(output) {
      if(output) {
        this.out();
      }
    }
    out() {
      this.routes.navigate(["/login/"]);
    }
    //inicia o processo de registro de produto
    initProductRegister() {
      this.productRegister = true;
      this.productsList = false;
      this.userList = false;
      this.orderList = false;
    }

    initListOrders() {
      this.productRegister = false;
      this.productsList = false;
      this.userList = false;
      this.orderList = true;
    }

    //inicia o processo de listagem de produtos
    initListProducts() {
      this.productRegister = false;
      this.productsList = true;
      this.userList = false;
      this.orderList = false;
    }
    //inicia o processo de listagem de usuários
    initListUsers() {
      this.productRegister = false;
      this.productsList = false;
      this.userList = true;
      this.orderList = false;
    }
    onProductEdit(output) {
      if(output.update) {
        this.productsList = false; 
       }
       this.triggerAlert(output.msg, output.type);
       setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }

    onDelProduct(output) {
      if(output.del) {
        this.productsList = false; 
       }
       this.triggerAlert(output.msg, output.type);
       setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }

    onDelUser(output) {
      if(output.del) {
        this.userList = false; 
       }
       this.triggerAlert(output.msg, output.type);
       setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }

    onEditUser(output) {
      if(output.update) {
        this.userList = false; 
       }
       this.triggerAlert(output.msg, output.type);
       setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }

    onProductRegister(output) {
     if(output.closeForm) {
      this.productRegister = false;
     }
     this.triggerAlert(output.msg, output.type);
     setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }

    onDelOrder(output) {
      if(output.del) {
        this.orderList = false; 
       }
       this.triggerAlert(output.msg, output.type);
       setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }

    onProcessOrder(output) {
      if(output.process) {
        this.orderList = false; 
       }
       this.triggerAlert(output.msg, output.type);
       setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
    }

    getUser() {
      let id = this.route.snapshot.paramMap.get("id"); //retorna o id da rota
      this.userService.serviceGetUser(id).subscribe(response => {
        this.user = response;
        console.log(this.user);
        this.userInfo = true;
      }) 
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
    ngOnInit(): void {
      this.getUser();
      
    }
  

}
