import pandas as pd
import os

def time_to_ns(time):
    """
    Convert a timestamp in HH:MM:SS.xxxxxxxxx to nanoseconds.
    """
    parts = time.split(':')
    hours = int(parts[0])
    minutes = int(parts[1])
    seconds = int(parts[2].split('.')[0])
    nanoseconds = int(parts[2].split('.')[1])
    return hours * 3600 * 10**9 + minutes * 60 * 10**9 + seconds * 10**9 + nanoseconds


def load_trade_data(trade_file):
    """
    Load trade data from a CSV file.
    """
    data = pd.read_csv(trade_file)
    data['timestamp'] = data['timestamp'].apply(time_to_ns)
    pd.to_datetime(data['timestamp'], unit='ns')
    return data
    

    
def load_market_data(market_files):
    dataframes = []
    i = 0
    for file in market_files:
        if i == 0:
            df = pd.read_csv(file)
            i = 1
        else:
            df = pd.read_csv(file, header=None)
            df.columns = dataframes[0].columns if dataframes else df.columns
        dataframes.append(df)

    data = pd.concat(dataframes, ignore_index=True)
    data['timestamp'] = data['timestamp'].apply(time_to_ns)
    pd.to_datetime(data['timestamp'], unit='ns')
    return data