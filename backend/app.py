from flask import Flask, jsonify
from flask_cors import CORS
from config import BASE_DIR
from utils import get_options_data, process_stock_data

app = Flask(__name__)
CORS(app)  # Enable CORS for the frontend to fetch data

@app.route('/api/options', methods=['GET'])
def get_options():
    try:
        return jsonify(get_options_data(BASE_DIR))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/period/<period>/stock/<stock>', methods=['GET'])
def get_stock_data(period, stock):
    try:
        response = process_stock_data(BASE_DIR, period, stock)
        return jsonify(response)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
