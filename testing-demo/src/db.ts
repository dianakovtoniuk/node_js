export interface Customer {
  id: number;
  points: number;
  email?: string;
}

export function getCustomerSync(id: number): Customer {
  console.log('Reading a customer from MongoDB...');
  return { id, points: 11 };
}

export async function getCustomer(id: number): Promise<Customer> {
  return new Promise((resolve) => {
    console.log('Reading a customer from MongoDB...');
    resolve({ id, points: 11 });
  });
}
