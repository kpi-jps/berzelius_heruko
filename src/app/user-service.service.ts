import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  baseURL = 'https://sc3012964-berzelius.glitch.me/api/usuarios/';

  constructor(private http : HttpClient) { }
  //registra um novo contato no banco de dados
  serviceRegisterUser(user) : Observable<any>{
    let body = new HttpParams();
    body = body.set("name", user.name);
    body = body.set("email", user.email);
    body = body.set("login", user.login);
    body = body.set("password", user.password);
    body = body.set("adm", user.adm);
    return this.http.post(this.baseURL, body, {observe: "response"});
  }
  //obtem todos os usuários registrados no banco de dados
  serviceGetUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.baseURL);
  }

  //checa se usuário tem ou não acesso
  serviceGetAccess(access, id : string) : Observable<any> {
    let body = new HttpParams();
    body = body.set("login", access.login);
    body = body.set("password", access.password);
    return this.http.post(this.baseURL + id, body, {observe: "response"});
  }
 
  //obtem um usuário específico registrado no banco de dados
  serviceGetUser(id : string) : Observable<any> {
    return this.http.get<any>(this.baseURL + id);
  }

  //deleta um usuário específico no banco de dados
  serviceDeleteUser(id : string) : Observable<any>{
    return this.http.delete(this.baseURL + id, {observe: "response"});
  }

  //atualiza um produto específico no banco de dados
  serviceUpdateUser(user, id : string) : Observable<any>{
    let body = new HttpParams();
    body = body.set("name", user.name);
    body = body.set("email", user.email);
    body = body.set("login", user.login);
    body = body.set("password", user.password);
    body = body.set("adm", user.adm);
    return this.http.put(this.baseURL + id, body, {observe: "response"});
  }

}
