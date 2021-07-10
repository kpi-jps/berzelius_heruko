import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  baseURL = 'https://sc3012964-berzelius.glitch.me/api/pedidos/';

  constructor(private http : HttpClient) { }
  //registra um novo contato no banco de dados
  serviceRegisterOrder(order) : Observable<any>{
    let body = new HttpParams();
    body = body.set("userLogin", order.userLogin);
    body = body.set("productId", order.productId);
    body = body.set("name", order.name);
    body = body.set("description", order.description);
    body = body.set("unity", order.unity);
    body = body.set("quantity", order.quantity);
    body = body.set("status", order.status);
    return this.http.post(this.baseURL, body, {observe: "response"}); 
  }

   //atualiza um produto específico no banco de dados
   serviceUpdateOrder(order, id : string) : Observable<any>{
    let body = new HttpParams();
    body = body.set("userLogin", order.userLogin);
    body = body.set("productId", order.productId);
    body = body.set("name", order.name);
    body = body.set("description", order.description);
    body = body.set("unity", order.unity);
    body = body.set("quantity", order.quantity);
    body = body.set("status", order.status);
    return this.http.put(this.baseURL + id, body, {observe: "response"});
  }
  //obtem todos os pedidos registrados no banco de dados
  serviceGetOrders() : Observable<Order[]> {
    return this.http.get<Order[]>(this.baseURL);
  }

  //deleta um pedido específico no banco de dados
  serviceDeleteOrder(id : string) : Observable<any>{
    return this.http.delete(this.baseURL + id, {observe: "response"});
  }

}
