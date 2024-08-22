document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    fetch('/add_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, name, quantity, price })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('productForm').reset();
            updateProductList();  // Refresh product list
            updateOutOfStockList(); // Refresh out-of-stock list
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('searchInput').addEventListener('input', function() {
    updateProductList(this.value);
});

function updateProductList(searchQuery = '') {
    fetch('/get_products')
    .then(response => response.json())
    .then(data => {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        const sortedProducts = data.products.sort((a, b) => a.name.localeCompare(b.name));
        const filteredProducts = sortedProducts.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
        filteredProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `Code: ${product.code}, Name: ${product.name}, Quantity: ${product.quantity}, Price: $${product.price}`;
            
            // Create Remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-button'; // Apply the remove-button class
            removeButton.addEventListener('click', () => removeProduct(product.code));
            li.appendChild(removeButton);
            
            productList.appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));
}

function updateOutOfStockList() {
    fetch('/get_products')
    .then(response => response.json())
    .then(data => {
        const outOfStockList = document.getElementById('outOfStockList');
        outOfStockList.innerHTML = '';
        const outOfStockProducts = data.products.filter(product => product.quantity <= 0);
        outOfStockProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `Code: ${product.code}, Name: ${product.name}, Quantity: ${product.quantity}, Price: $${product.price}`;
            
            // Create Remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-button'; // Apply the remove-button class
            removeButton.addEventListener('click', () => removeProduct(product.code));
            li.appendChild(removeButton);
            
            outOfStockList.appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));
}

function removeProduct(code) {
    fetch('/remove_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            updateProductList();  // Refresh product list
            updateOutOfStockList(); // Refresh out-of-stock list
        }
    })
    .catch(error => console.error('Error:', error));
}

updateProductList();
updateOutOfStockList();
