const request = require('supertest');
const app = require('../app');

describe('Product API Tests', () => {
    describe('GET /products', () => {
        it('should return all products', async () => {
            const res = await request(app).get('/products');
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('GET /products/:id', () => {
        it('should return a product by ID', async () => {
            const newProduct = { name: 'Test Product', price: 100, stock: 10 };
            const createdProduct = await request(app).post('/products').send(newProduct);
            const res = await request(app).get(`/products/${createdProduct.body.id}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: createdProduct.body.id,
                name: 'Test Product',
                price: 100,
                stock: 10
            }));
        });

        it('should return 404 if product not found', async () => {
            const res = await request(app).get('/products/9999');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });
    });


    describe('POST /products', () => {
        it('should add a new product', async () => {
            const newProduct = { name: 'New Product', price: 100, stock: 10 };
            const res = await request(app).post('/products').send(newProduct);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name', newProduct.name);
            expect(res.body).toHaveProperty('price', newProduct.price);
            expect(res.body).toHaveProperty('stock', newProduct.stock);

            const getRes = await request(app).get('/products');
            expect(getRes.status).toBe(200);
            expect(getRes.body).toBeInstanceOf(Array);
            expect(getRes.body.length).toBeGreaterThan(0);
            expect(getRes.body).toEqual(expect.arrayContaining([expect.objectContaining(newProduct)]));
        });

        it('should update a product with partial data', async () => {
            const newProduct = { name: 'New Product', price: 100, stock: 10 };
            const createdProduct = await request(app).post('/products').send(newProduct);

            const updatedProduct = { price: 150 }; // Update only price in this test
            const res = await request(app)
                .put(`/products/${createdProduct.body.id}`)
                .send(updatedProduct);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', createdProduct.body.id);
            expect(res.body).toHaveProperty('name', newProduct.name); // Name should remain unchanged
            expect(res.body).toHaveProperty('price', updatedProduct.price);
            expect(res.body).toHaveProperty('stock', newProduct.stock);


        });

        it('should handle missing or undefined price in request body', async () => {
            // Test case 1: Price is missing
            const newProduct = { name: 'New Product', price: 100, stock: 10 };
            const createdProduct = await request(app).post('/products').send(newProduct);

            const updatedProduct = { name: 'Updated Product' }; // Omit price
            const res = await request(app)
                .put(`/products/${createdProduct.body.id}`)
                .send(updatedProduct);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', createdProduct.body.id);
            expect(res.body).toHaveProperty('name', updatedProduct.name);
            expect(res.body).toHaveProperty('price', newProduct.price); // Ensure price remains unchanged

            // Test case 2: Price is undefined
            updatedProduct.price = undefined;
            const res2 = await request(app)
                .put(`/products/${createdProduct.body.id}`)
                .send(updatedProduct);

            expect(res2.status).toBe(200);
            expect(res2.body).toHaveProperty('id', createdProduct.body.id);
            expect(res2.body).toHaveProperty('name', updatedProduct.name);
            expect(res2.body).toHaveProperty('price', newProduct.price); // Ensure price remains unchanged
        });
    });

    describe('PUT /products/:id', () => {
        it('should update an existing product', async () => {
            const newProduct = { name: 'New Product', price: 100, stock: 10 };
            const createdProduct = await request(app).post('/products').send(newProduct);
            const updatedProduct = { name: 'Updated Product', price: 150 };
            const res = await request(app)
                .put(`/products/${createdProduct.body.id}`)
                .send(updatedProduct);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', createdProduct.body.id);
            expect(res.body).toHaveProperty('name', updatedProduct.name);
            expect(res.body).toHaveProperty('price', updatedProduct.price);
            expect(res.body).toHaveProperty('stock', newProduct.stock);

            const getProductRes = await request(app).get(`/products/${createdProduct.body.id}`);
            expect(getProductRes.status).toBe(200);
            expect(getProductRes.body).toEqual(expect.objectContaining(updatedProduct));
        });

        it('should return 404 if product not found', async () => {
            const updatedProduct = { name: 'Non-Existent Product', price: 200 };

            const res = await request(app)
                .put('/products/9999')
                .send(updatedProduct);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });
    });

    describe('DELETE /products/:id', () => {
        it('should delete a product', async () => {
            const newProduct = { name: 'Test Product', price: 100, stock: 10 };
            const createdProduct = await request(app).post('/products').send(newProduct);

            const res = await request(app).delete(`/products/${createdProduct.body.id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Product deleted');

            const getProductRes = await request(app).get(`/products/${createdProduct.body.id}`);
            expect(getProductRes.status).toBe(404);
        });

        it('should return 404 if product not found', async () => {
            const res = await request(app).delete('/products/9999');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });
    });

});