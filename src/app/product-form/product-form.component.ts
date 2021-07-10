import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductServiceService } from '../product-service.service';
import { EventEmitter, Output } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Output() onCreateProduct = new EventEmitter<Object>();
  product : Product;
  productForm : FormGroup //controla o formulário de cadastramento de produtos
  namePlaceHolder : string = 'Nome';
  descriptionPlaceHolder : string = 'Descrição';
  unityPlaceHolder : string = 'Unidade (kg, L, etc)';
  quantityPlaceHolder : string = 'Quantidade';
  obsPlaceHolder : string = 'Observações em geral';
  

  constructor(private productService: ProductServiceService) { }

  //inicia o formulário de acesso
  private initForm() : void {
    this.productForm = new FormGroup({
      name : new FormControl(null, [Validators.required]),
      description : new FormControl(null, [Validators.required]),
      unity : new FormControl(null, [Validators.required]),
      quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
      obs: new FormControl('')
    });
  }
  //salva um produto no banco de dados
  onSubmit() {
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
      this.productService.serviceRegisterProduct(product).subscribe(res => {
        if(res.ok == true) {
          msg = 'Produto cadastrado com sucesso!';
          this.onCreateProduct.emit({msg: msg, type: "success", closeForm: true});
          
        } else {
          msg = 'Erro, o produto não foi cadastrado!';
          this.onCreateProduct.emit({msg: msg, type: "error", closeForm: false});
        }
      });
    } else {
      console.log("campos não preenchidos");
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
      this.onCreateProduct.emit({msg: msg, type: "error", closeForm: false});
    }
  }

  ngOnInit(): void {

    this.initForm();
  }

}
