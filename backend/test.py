import os
import shutil
import pandas as pd

BASE_DIR = os.getenv("BASE_DIR")
market_data_list = []

for dir in os.listdir(BASE_DIR):
    print(dir)
    period = os.path.join(BASE_DIR, dir)
    for market in os.listdir(period):
        print(market)
        marketDir = os.path.join(period, market)
        df_list = []

        for marketFile in os.listdir(marketDir):
            if (marketFile.startswith("market")):
                print(marketFile)
                df_list.append(pd.read_csv(os.path.join(marketDir, marketFile)))
        df = pd.concat(df_list, ignore_index=True)
        # df.to_csv(os.path.join(marketDir, ('market_data_' + market + '.csv')), index=False)
    
    
            
