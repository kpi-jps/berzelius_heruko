import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserServiceService } from '../user-service.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  user : User;
  userInfo : boolean = false; //controla a visualização das informações do usuário
  
  productsList : boolean = false; //controla a visualização da lista de produtos
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
  
  getUser() {
    let id = this.route.snapshot.paramMap.get("id"); //retorna o id da rota
    this.userService.serviceGetUser(id).subscribe(response => {
      this.user = response;
      //console.log(this.user);
      this.userInfo = true;
    }) 
  }
  onTimeOff(output) {
    if(output) {
      this.out();
    }
  }
  out() {
    this.routes.navigate(["/login/"]);
  }
  //inicia o processo de listagem de pedidos
  initListOrders() {
    this.productsList = false;
    this.orderList = true;
  }

  //inicia o processo de listagem de produtos
  initListProducts() {
    this.productsList = true;
    this.orderList = false;
  }

  onOrderProduct(output) {
    if(output.order) {
      this.productsList = false; 
     }
     this.triggerAlert(output.msg, output.type);
     setTimeout(()=>{this.closeAlert()}, 3000); //fecha automaticamente o alerta depois de 3s
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
