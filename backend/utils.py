import os
import pandas as pd
from loader import load_trade_data, load_market_data


def get_options_data(base_dir):
    """
    Retrieve available periods and stocks dynamically from the directory structure.
    """
    periods = sorted([d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))])
    stocks = sorted(os.listdir(os.path.join(base_dir, periods[0])))  # Assume all periods have the same stocks
    return {"periods": periods, "stocks": stocks}


def merge_trade_and_market_data(trade_data, market_data):
    """
    Return trade and market data as separate keys in a dictionary.
    """
    try:
        # Return the trade and market data as separate keys in a dictionary
        return {
            "tradeData": trade_data.to_dict(orient='records'),
            "marketData": market_data.to_dict(orient='records')
        }
    except Exception as e:
        print("Error in merge_trade_and_market_data:")
        print(e)
        return None


def process_stock_data(base_dir, period, stock):
    """
    Process stock data for a given period and stock, and return the result as a dictionary.
    """
    # Handle special period conditions
    if period not in ["Period1", "Period2", "Period3"]:
        period += "/" + period

    # Define file paths
    period_dir = os.path.join(base_dir, period, stock)
    trade_file = os.path.join(period_dir, f"trade_data__{stock}.csv")
    market_files = [os.path.join(period_dir, file) for file in os.listdir(period_dir) if not file.startswith("trade")]
    
    market_files.sort()

    # Load trade and market data
    trade_data = load_trade_data(trade_file)
    if trade_data is None:
        return None

    market_data = load_market_data(market_files)
    if market_data is None:
        return None

    # Return trade and market data as a dictionary
    result = merge_trade_and_market_data(trade_data, market_data)
    return result

