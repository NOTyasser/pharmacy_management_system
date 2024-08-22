from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# File path for storing product data
PRODUCTS_FILE = 'products.json'

def load_products():
    if os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'r') as file:
            return json.load(file)
    return []

def save_products(products):
    with open(PRODUCTS_FILE, 'w') as file:
        json.dump(products, file, indent=4)

# Load products from file
products = load_products()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.json
    product = {
        'code': data['code'],
        'name': data['name'],
        'quantity': data['quantity'],
        'price': data['price']
    }
    products.append(product)
    save_products(products)
    return jsonify({'status': 'success', 'product': product})

@app.route('/get_products', methods=['GET'])
def get_products():
    return jsonify({'products': products})

@app.route('/remove_product', methods=['POST'])
def remove_product():
    data = request.json
    code = data['code']
    global products
    products = [product for product in products if product['code'] != code]
    save_products(products)
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
