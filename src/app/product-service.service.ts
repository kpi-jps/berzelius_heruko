import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from "rxjs";
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  
  baseURL = 'https://sc3012964-berzelius.glitch.me/api/produtos/';

  constructor(private http : HttpClient) { }
  //registra um novo contato no banco de dados
  serviceRegisterProduct(product) : Observable<any>{
    let body = new HttpParams();
    body = body.set("name", product.name);
    body = body.set("description", product.description);
    body = body.set("unity", product.unity);
    body = body.set("quantity", product.quantity);
    body = body.set("obs", product.obs);
    body = body.set("inStock", product.inStock);
    return this.http.post(this.baseURL, body, {observe: "response"}); 
  }

  //atualiza um produto específico no banco de dados
  serviceUpdateProduct(product, id : string) : Observable<any>{
    let body = new HttpParams();
    body = body.set("name", product.name);
    body = body.set("description", product.description);
    body = body.set("unity", product.unity);
    body = body.set("quantity", product.quantity);
    body = body.set("obs", product.obs);
    body = body.set("inStock", product.inStock);
    return this.http.put(this.baseURL + id, body, {observe: "response"});
  }
  //obtem todos os produtoss registrados no banco de dados
  serviceGetProducts() : Observable<Product[]> {
    return this.http.get<Product[]>(this.baseURL);
  }

  //deleta um um produto específico no banco de dados
  serviceDeleteProduct(id : string) : Observable<any>{
    return this.http.delete(this.baseURL + id, {observe: "response"});
  }

  //obtem um produto específico registrado no banco de dados
  serviceGetProduct(id : string) : Observable<any> {
    return this.http.get<any>(this.baseURL + id);
  }
}
