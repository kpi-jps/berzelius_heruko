import { Component, OnInit, Input } from '@angular/core';
import { ProductServiceService } from '../product-service.service';
import { OrderServiceService } from '../order-service.service';
import { EventEmitter, Output } from '@angular/core';
import { User } from '../user';
import { Product } from '../product';
import { Order } from '../order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  @Input() activeUser: User; //recebe informações do usuário logado e ativo
  @Output() onProcessOrder = new EventEmitter<Object>();
  @Output() onDelOrder = new EventEmitter<Object>();
  constructor(private productService: ProductServiceService, private orderService: OrderServiceService) { }
  orders : Order[] = []; //lsta de pedidos
  order : Order; //pedido
  confirm : boolean = false; //controla a vizualizaçãao do modal de confirm
  confirmMsg : string; //mensagem do confirm
  process : boolean = false //controla a visualização do modal do processamento de pedidos
  orderProduct : Product;//armazena o produto atrelado ao  pedido
  orderProductId : string; //armazena o id do produto atrelado ao pedido

  productName : String = '';
  productQuantity : Number = 0;
  productUnity : String = '';
  orderQuantity : Number = 0;
 
  orderId : string = ''; //armazena o id do pedido para os processos de deleção e edição
  orderStatus : string = ''//armazena o status do pedido
  empty : boolean = false; //indica se a lista de produtos está vazia

  cancelProcess() {
    this.process = false;
  }

  cancelDel() {
    this.confirm = false;
  }

  initDel(order : Order) {
    this.confirm = true;
    this.orderId = order._id;
    this.confirmMsg = 'Tem certeza que deseja deletar o pedido: ' + this.orderId + ' ?';
  }

  onDel() {
    let msg : string = '';
    this.orderService.serviceDeleteOrder(this.orderId).subscribe(res => {
      if(res.ok == true) {
        msg = 'Pedido deletado com sucesso!';
        this.onDelOrder.emit({msg: msg, type: "success", del: true});
        this.confirm = false;
      } else {
        msg = 'Erro, o produto não foi deletado!'
        this.onDelOrder.emit({msg: msg, type: "error", del: false});
      }
    });
  }

  

  initProcess(order) {
    this.productService.serviceGetProduct(order.productId).subscribe(response => {
      this.orderProduct = response;
      this.productName = this.orderProduct.name;
      this.productQuantity = this.orderProduct.quantity;
      this.productUnity = this.orderProduct.unity;
      this.process = true;
      this.order = order;
      this.orderId = order._id;
      this.orderProductId = order.productId;
      this.orderQuantity = order.quantity;
      this.orderStatus = order.status;
    });
  }
  /*
  getProduct() {
    this.productService.serviceGetProduct(this.orderProductId).subscribe(response => {
      this.orderProduct = response;
      this.productName = this.orderProduct.name;
      this.productQuantity = this.orderProduct.quantity;
      this.productUnity = this.orderProduct.unity;
    }) 
  }
  */
  processOrder() {
    let msg = '';
    if(this.orderQuantity > this.productQuantity) {
      msg = 'Pedido impossivel de ser processado! Quantidade em estoque inferior a pedida';
      this.onProcessOrder.emit({msg: msg, type: "error", process: true});
      this.confirm = false;
    }else if (this.orderStatus == 'Processado') {
      msg = 'Pedido já processado';
      this.onProcessOrder.emit({msg: msg, type: "error", process: true});
      this.confirm = false;
    }else {
      let product = {
        name: this.orderProduct.name,
        description: this.orderProduct.description,
        unity: this.orderProduct.unity,
        quantity: Number(this.productQuantity) - Number(this.orderQuantity),
        obs: this.orderProduct.obs,
        inStock: true //seta como se existe o produto em estoque
      }
      let order = {
        userLogin: this.order.userLogin,
        productId: this.orderProductId,
        name: this.order.name , 
        description: this.order.description, 
        unity: this.order.unity,   
        quantity: this.order.quantity,  //quantidade de produto pedida
        status: 'Processado'
      }
      if (product.quantity == 0) {
          product.inStock = false;
      }
      this.productService.serviceUpdateProduct(product, this.orderProduct._id).subscribe(res => {
        if(res.ok == true) {
          this.orderService.serviceUpdateOrder(order, this.orderId).subscribe(response => {
            if(response.ok == true) {
              msg = 'Pedido processado com sucesso!';
              this.onProcessOrder.emit({msg: msg, type: "success", process: true});
              this.confirm = false;
            }
          });
          
        } else {
          msg = 'Erro ao processar pedido';
          this.onProcessOrder.emit({msg: msg, type: "error", process: true});
          this.confirm = false;
        }
      }); 
    }

  }

  getOrders() {
    this.orderService.serviceGetOrders().subscribe(response => {
      if (response.length == 0) {
        this.empty = true;
      } else { 
        if(this.activeUser.adm) { //se for admnistrador lista todos os pedidos
          this.orders = response;
          //console.log(response);
        } else { //se não, lista só os pedidos do usuário logado
          for (let i = 0; i < response.length; i++) {
            if(this.activeUser.login == response[i].userLogin) {
              this.orders.push(response[i]);
            }
          }
        }
        
      }
      
    });
  }

  ngOnInit(): void {
    this.getOrders()
  }

}
