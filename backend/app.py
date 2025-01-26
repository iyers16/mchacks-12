from flask import Flask, jsonify
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the frontend to fetch data

# Define the base data directory
BASE_DIR = "/home/iyers16/Documents/mchacks-12/backend/TrainingData"

@app.route('/api/options', methods=['GET'])
def get_options():
    try:
        # Dynamically gather periods and stocks from the directory structure
        periods = sorted([d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d))])
        stocks = sorted(os.listdir(os.path.join(BASE_DIR, periods[0])))  # Assume all periods have the same stocks
        return jsonify({"periods": periods, "stocks": stocks})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/period/<period>/stock/<stock>', methods=['GET'])
def get_stock_data(period, stock):
    try:
        # Directory paths
        if period not in ["Period1", "Period2", "Period3"]:
            period += "/" + period
        period_dir = os.path.join(BASE_DIR, period, stock)
        trade_file = os.path.join(period_dir, f"trade_data__{stock}.csv")
        market_files = [os.path.join(period_dir, file) for file in os.listdir(period_dir) if file.startswith("market_data")]

        # Load trade data
        trade_data = pd.read_csv(trade_file)
        trade_data['timestamp'] = pd.to_datetime(
            trade_data['timestamp'], format='%H:%M:%S.%f', errors='coerce'
        )

        # Load and concatenate market data
        market_data_list = []
        for i, market_file in enumerate(market_files):
            if i == 0:
                # Read the first file with headers
                df = pd.read_csv(market_file)
            else:
                # Read subsequent files without headers, and assign column names manually
                df = pd.read_csv(market_file, header=None, names=["bidVolume", "bidPrice", "askVolume", "askPrice", "timestamp"])
            market_data_list.append(df)

        # Concatenate all DataFrames into one
        market_data = pd.concat(market_data_list, ignore_index=True)
        market_data['timestamp'] = pd.to_datetime(
            market_data['timestamp'], format='%H:%M:%S.%f', errors='coerce'
        )

        # Drop rows with invalid timestamps
        trade_data.dropna(subset=['timestamp'], inplace=True)
        market_data.dropna(subset=['timestamp'], inplace=True)

        # Merge the trade and market data
        merged_data = pd.merge_asof(
            trade_data.sort_values('timestamp'),
            market_data.sort_values('timestamp'),
            on='timestamp',
            direction='nearest'
        )

        # Prepare JSON response for the frontend
        response = merged_data[['timestamp', 'price', 'bidPrice', 'askPrice']].to_dict(orient='records')
        return jsonify(response)

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
