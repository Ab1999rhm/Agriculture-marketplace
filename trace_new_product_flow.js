const http = require('http');

function request(options, body) {
  return new Promise((resolve) => {
    const req = http.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // 1. Login
  const login = await request({ hostname:'localhost', port:8080, path:'/api/auth/login', method:'POST', headers:{'Content-Type':'application/json'} }, { email:'fikaduabraham093@gmail.com', password:'12345qwer' });
  const { token, user } = login.body;
  const auth = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
  console.log('Logged in as:', user.id);

  // 2. Add a NEW product (same as the frontend "Add Product" form would do)
  const newProd = await request({ hostname:'localhost', port:8080, path:'/api/products', method:'POST', headers:auth }, {
    name: 'Test Teff',
    price: 250,
    unit: 'kg',
    quantity: 100,
    category: 'grain',
    farmerId: user.id
  });
  console.log('Add product status:', newProd.status);
  console.log('New product:', JSON.stringify(newProd.body));

  if (newProd.status !== 201) return;
  const productId = newProd.body.id || newProd.body._id;
  const productName = newProd.body.name;
  console.log('Product ID:', productId, 'Name:', productName);

  // 3. Now try to add bulk discount for that new product
  const discount = await request({ hostname:'localhost', port:8080, path:'/api/bulk-discounts', method:'POST', headers:auth }, {
    productId,
    product: productName,
    minQuantity: 10,
    discountPercent: 5,
    active: true,
    farmerId: user.id,
    originalPrice: 250
  });
  console.log('Add discount status:', discount.status);
  console.log('Discount result:', JSON.stringify(discount.body));
}

main().catch(console.error);
