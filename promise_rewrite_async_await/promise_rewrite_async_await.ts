// async function notifyCustomer() {
//   const customer = await getCustomer(1);
//   console.log('Customer: ', customer);
//   if (customer.isGold) {
//     const movies = await getTopMovies();
//     console.log('Top movies: ', movies);
//     await sendEmail(customer.email, movies);
//     console.log('Email sent...');
//   }
// }

interface Customer {
  id: number;
  name: string;
  isGold: boolean;
  email: string;
}

async function notifyCustomer(): Promise<void> {
  const customer = await getCustomer(1);
  console.log('Customer: ', customer);
  if (customer.isGold) {
    const movies = await getTopMovies();
    console.log('Top movies: ', movies);
    await sendEmail(customer.email, movies);
    console.log('Email sent...');
  }
}
notifyCustomer();

function getCustomer(id: number): Promise<Customer> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Mosh Hamedani',
        isGold: true,
        email: 'email',
      });
    }, 4000);
  });
}

function getTopMovies(): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['movie1', 'movie2']);
    }, 4000);
  });
}

function sendEmail(email: string, movies: string[]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 4000);
  });
}