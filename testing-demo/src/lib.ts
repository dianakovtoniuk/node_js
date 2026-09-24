import * as db from './db';
import * as mail from './mail';

export interface Order {
  customerId: number;
  totalPrice: number;
}

export interface Product {
  id: number;
  price: number;
}

export interface User {
  id: number;
  username: string;
}

// Testing numbers
export function absolute(number: number): number {
  if (number > 0) return number;
  if (number < 0) return -number;
  return 0;
}

// Testing strings
export function greet(name: string): string {
  return 'Welcome ' + name;
}

// Testing arrays
export function getCurrencies(): string[] {
  return ['USD', 'AUD', 'EUR'];
}

// Testing objects
export function getProduct(productId: number): Product {
  return { id: productId, price: 10 };
}

// Testing exceptions
export function registerUser(username?: string): User {
  if (!username) throw new Error('Username is required.');

  return { id: new Date().getTime(), username };
}

// Mock functions
export function applyDiscount(order: Order): void {
  const customer = db.getCustomerSync(order.customerId);

  if (customer.points > 10) order.totalPrice *= 0.9;
}

// Mock functions
export function notifyCustomer(order: Order): void {
  const customer = db.getCustomerSync(order.customerId);

  mail.send(customer.email, 'Your order was placed successfully.');
}
