from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory storage for products
products = []

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
    return jsonify({'status': 'success', 'product': product})

@app.route('/remove_product', methods=['POST'])
def remove_product():
    data = request.json
    code = data['code']
    global products
    products = [product for product in products if product['code'] != code]
    return jsonify({'status': 'success'})

@app.route('/get_products', methods=['GET'])
def get_products():
    return jsonify({'products': products})

if __name__ == '__main__':
    app.run(debug=True)
