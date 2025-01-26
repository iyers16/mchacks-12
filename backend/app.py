from flask import Flask, jsonify
from flask_cors import CORS
from utils import get_options_data, process_stock_data
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for the frontend to fetch data

# Define the base data directory
BASE_DIR = os.getenv("BASE_DIR")

@app.route('/api/options', methods=['GET'])
def get_options():
    try:
        print(get_options_data(BASE_DIR))
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
    app.run(debug=True, port=8080)
