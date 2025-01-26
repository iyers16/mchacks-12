import os
import pandas as pd


def get_options_data(base_dir):
    """
    Retrieve available periods and stocks dynamically from the directory structure.
    """
    periods = sorted([d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))])
    stocks = sorted(os.listdir(os.path.join(base_dir, periods[0])))  # Assume all periods have the same stocks
    return {"periods": periods, "stocks": stocks}


def load_trade_data(trade_file):
    """
    Load and clean trade data from the given file.
    """
    trade_data = pd.read_csv(trade_file)
    trade_data['timestamp'] = pd.to_datetime(
        trade_data['timestamp'], format='%H:%M:%S.%f', errors='coerce'
    )
    trade_data.dropna(subset=['timestamp'], inplace=True)
    return trade_data


def load_market_data(market_files):
    """
    Load and concatenate market data from multiple files.
    """
    market_data_list = []
    for i, market_file in enumerate(market_files):
        if i == 0:
            # Read the first file with headers
            df = pd.read_csv(market_file)
        else:
            # Read subsequent files without headers and assign column names manually
            df = pd.read_csv(market_file, header=None, names=["bidVolume", "bidPrice", "askVolume", "askPrice", "timestamp"])
        market_data_list.append(df)

    # Concatenate all DataFrames into one
    market_data = pd.concat(market_data_list, ignore_index=True)
    market_data['timestamp'] = pd.to_datetime(
        market_data['timestamp'], format='%H:%M:%S.%f', errors='coerce'
    )
    market_data.dropna(subset=['timestamp'], inplace=True)
    return market_data


def merge_trade_and_market_data(trade_data, market_data):
    """
    Merge trade and market data using a nearest timestamp merge.
    """
    return pd.merge_asof(
        trade_data.sort_values('timestamp'),
        market_data.sort_values('timestamp'),
        on='timestamp',
        direction='nearest'
    )


def process_stock_data(base_dir, period, stock):
    """
    Process stock data for a given period and stock, and return the merged result.
    """
    # Handle special period conditions
    if period not in ["Period1", "Period2", "Period3"]:
        period += "/" + period

    # Define file paths
    period_dir = os.path.join(base_dir, period, stock)
    trade_file = os.path.join(period_dir, f"trade_data__{stock}.csv")
    market_files = [os.path.join(period_dir, file) for file in os.listdir(period_dir) if file.startswith("market_data")]

    # Load trade and market data
    trade_data = load_trade_data(trade_file)
    market_data = load_market_data(market_files)

    # Merge and prepare the response
    merged_data = merge_trade_and_market_data(trade_data, market_data)
    return merged_data[['timestamp', 'price', 'bidPrice', 'askPrice']].to_dict(orient='records')
