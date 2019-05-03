import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import Product from './product';

const staticProducts: Product[] = [
  { id: 1, title: 'DSA.js', description: 'Data Structures and Algorithms in JavaScript', price: 9.40, photoUrls: [''] },
  { id: 2, title: 'MEANshop',
    description: 'Build an E-commerce app in MongoDB, ExpressJS, Angular and Node (MEAN)', price: 9.85, photoUrls: [''] },
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(staticProducts);
  }

  getProduct(id: number): Observable<Product> {
    return of(staticProducts.find(p => p.id === id));
  }
}
