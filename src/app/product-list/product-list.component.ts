import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductServiceService } from '../product-service.service';
import { OrderServiceService } from '../order-service.service';
import { EventEmitter, Output } from '@angular/core';
import { User } from '../user';
import { Product } from '../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Input() activeUser: User; //recebe informações do usuário logado e ativo
  @Output() onEditProduct = new EventEmitter<Object>();
  @Output() onDelProduct = new EventEmitter<Object>();
  @Output() onOrderProduct = new EventEmitter<Object>();

  constructor(private productService: ProductServiceService, private orderService: OrderServiceService) { }

  products : Product[] = [];//armazena os produtos recuperados do banco de dados
  confirm : boolean = false; //controla a vizualizaçãao do modal de confirm
  confirmMsg : string; //mensagem do confirm
  edit : boolean = false //controla a visualização do modal com o formulário de edição
  order : boolean = false; //controla  a visualização do formulário de pedidos
  productForm : FormGroup //controla o formulário de cadastramento de produtos
  orderForm : FormGroup //controla o formulário de pedido de produtos
  selectedProduct : Product;//armazena o produto selecionado para pedido
  productName : String = '';
  productQuantity : Number = 0;
  productUnity : String = '';
  namePlaceHolder : string = 'Nome';
  descriptionPlaceHolder : string = 'Descrição';
  unityPlaceHolder : string = 'Unidade (kg, L, etc)';
  quantityPlaceHolder : string = 'Quantidade';
  obsPlaceHolder : string = 'Observações em geral';
  productId : string; //armazena o id do produto para os processos de deleção e edição
  empty : boolean = false; //indica se a lista de produtos está vazia
  
  //inicia o formulário de edição
  private initProductForm() : void {
    this.productForm = new FormGroup({
      name : new FormControl(null, [Validators.required]),
      description : new FormControl(null, [Validators.required]),
      unity : new FormControl(null, [Validators.required]),
      quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
      obs: new FormControl(null)
    });
  }

  private initOrderForm() : void {
    this.orderForm = new FormGroup({
      quantity: new FormControl(0, [Validators.required]),
    });
  }
  
  initEdit(product : Product) {
    this.edit = true;
    this.productForm.get('name').setValue(product.name);
    this.productForm.get('description').setValue(product.description);
    this.productForm.get('unity').setValue(product.unity);
    this.productForm.get('quantity').setValue(product.quantity);
    this.productForm.get('obs').setValue(product.obs);
    this.productId = product._id;
    //console.log(product);
  }

  onSubmitEdit() {
    let msg = '';
    if(this.productForm.get('name').valid && this.productForm.get('description').valid && this.productForm.get('unity').valid && this.productForm.get('quantity').valid){
      let product = {
        name: this.productForm.get('name').value,
        description: this.productForm.get('description').value,
        unity: this.productForm.get('unity').value,
        quantity: this.productForm.get('quantity').value,
        obs: this.productForm.get('obs').value,
        inStock: true //seta como se existe o produto em estoque
      }
      if (product.quantity == 0) {
        product.inStock = false;
      }
      this.productService.serviceUpdateProduct(product, this.productId).subscribe(res => {
        if(res.ok == true) {
          msg = 'Produto atualizado com sucesso!';
          this.onEditProduct.emit({msg: msg, type: "success", update: true});
          this.edit = false;
          
        } else {
          msg = 'Erro, o produto não foi atualizado!';
          this.onEditProduct.emit({msg: msg, type: "error", update: false});
        }
      });
    } else {
      //console.log("campos não preenchidos");
      msg = '';
      if(!this.productForm.get('name').valid){
        msg += 'Campo "Nome do reagente" não preenchido! ';
      } 
      if(!this.productForm.get('description').valid) {
        msg += 'Campo "Descrição" não preenchido ou com formato inválido! ';
      }
      if(!this.productForm.get('unity').valid) {
        msg += 'Campo "Unidade" não preenchido! ';
      } 
      if(!this.productForm.get('quantity').valid) {
        msg += 'Campo "Quantidade" não preenchido!';
      }
      this.onEditProduct.emit({msg: msg, type: "error", update: false});
    }
  }

  cancelEdit() {
    this.edit = false;
  }

  cancelDel() {
    this.confirm = false;
  }


  initDel(product : Product) {
    this.confirm = true;
    this.productId = product._id;
    this.confirmMsg = 'Tem certeza que deseja deletar o produto: ' + product.name + ' ?';
  }

  onDel() {
    let msg : string = '';
    this.productService.serviceDeleteProduct(this.productId).subscribe(res => {
      if(res.ok == true) {
        msg = 'Produto deletado com sucesso!';
        this.onDelProduct.emit({msg: msg, type: "success", del: true});
        this.confirm = false;
      } else {
        msg = 'Erro, o produto não foi deletado!'
        this.onDelProduct.emit({msg: msg, type: "error", del: false});
      }
    });
  }

  getProducts() {
    this.productService.serviceGetProducts().subscribe(response => {
      if (response.length == 0) {
        this.empty = true;
      } else {
        this.products = response;
        //console.log(response);
      }
      
    });
  }

  initOrder(product : Product) {
    this.productId = product._id;
    this.selectedProduct = product;
    this.productName = this.selectedProduct.name;
    this.productQuantity = this.selectedProduct.quantity;
    this.productUnity = this.selectedProduct.unity;
    this.order = true;
    //console.log(this.selectedProduct);
  }

  
  onSubmitOrder() {
    let msg = '';
    if(this.orderForm.get('quantity').valid){
      let order = {
        userLogin: this.activeUser.login, //login do usuário   
        productId: this.selectedProduct._id, // id do produto
        name: this.selectedProduct.name,  //nome do produto
        description: this.selectedProduct.description, //descrição do produto
        unity: this.selectedProduct.unity, //unidade em que é medida a quantidade do produto   
        quantity: this.orderForm.get('quantity').value,  //quantidade de produto pedida
        status: 'Não processado' //status do pedido
      }
      if (order.quantity > this.selectedProduct.quantity) {
        msg = 'A quantidade pedida não pode ser maior que a em estoque!';
        this.onOrderProduct.emit({msg: msg, type: "error", order: false});
      } else if(order.quantity == 0) {
        msg = 'O valor pedido não pode ser igual a zero';
        this.onOrderProduct.emit({msg: msg, type: "error", order: false});
      } else {
        this.orderService.serviceRegisterOrder(order).subscribe(res => {
          if(res.ok == true) {
            msg = 'Pedido registrado com sucesso!';
            this.onOrderProduct.emit({msg: msg, type: "success", order: true});
            
          } else {
            msg = 'Erro, ao fazer pedido!';
            this.onOrderProduct.emit({msg: msg, type: "error", order: false});
          }
        });
      }
    } else {
      msg = 'O campo "Quantidade do pedido" precisa ser preenchido!';
      this.onOrderProduct.emit({msg: msg, type: "error", order: false});
    }
  }

  cancelOrder() {
    this.order = false;
  }

  ngOnInit(): void {
    this.getProducts();
    this.initProductForm();
    this.initOrderForm();
  }

 
  
}
