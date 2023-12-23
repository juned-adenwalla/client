import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  private cartKey = 'cart';
  private bookMarkKey = 'bookmark' ;

  getCart() {
    const cartData = localStorage.getItem(this.cartKey);
    return cartData ? JSON.parse(cartData) : [];
  }

  addToCart(product:any): void {
    const cart = this.getCart();
    cart.push(product);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    Swal.fire("Success","Added To Cart :)","success");
  }

  removeFromCart(index:any){
    let cartData:any = localStorage.getItem(this.cartKey);
    cartData = JSON.parse(cartData);
    cartData.splice(index, 1);
    localStorage.setItem(this.cartKey, JSON.stringify(cartData));
    Swal.fire("Warning","Removed From Cart :)","warning");
  }

  flushAll(){
    localStorage.removeItem(this.cartKey)
  }

  getBookmark() {
    const bookMarkData = localStorage.getItem(this.bookMarkKey);
    return bookMarkData ? JSON.parse(bookMarkData) : [];
  }

  addbookMark(product:any): void{
    const bookmark = this.getBookmark();
    bookmark.push(product);
    localStorage.setItem(this.bookMarkKey, JSON.stringify(bookmark));
    Swal.fire("Success","Added To Favorites :)","success");
  }

  removeFromBookmark(index:any){
    let bookData:any = localStorage.getItem(this.bookMarkKey);
    bookData = JSON.parse(bookData);
    bookData.splice(index, 1);
    localStorage.setItem(this.bookMarkKey, JSON.stringify(bookData));
    Swal.fire("Warning","Removed From Favorites :)","warning");
  }
}
