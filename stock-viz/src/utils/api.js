import axios from "axios";

export const fetchOptions = async () => {
  const response = await axios.get("http://127.0.0.1:5000/api/options");
  return response.data;
};

export const fetchStockData = async (period, stock) => {
  const response = await axios.get(
    `http://127.0.0.1:5000/api/period/${period}/stock/${stock}`
  );
  const { tradeData, marketData } = response.data;
  console.log(tradeData);
  console.log(marketData);

  const tradeSeries = {
    name: "Trade",
    data: tradeData.map((item) => [
      new Date(item.timestamp).getTime(),
      item.price,
    ]),
  };

  const bidSeries = {
    name: "Bid",
    data: marketData.map((item) => [
      new Date(item.timestamp).getTime(),
      item.bidPrice,
    ]),
  };

  const askSeries = {
    name: "Ask",
    data: marketData.map((item) => [
      new Date(item.timestamp).getTime(),
      item.askPrice,
    ]),
  };

  return {
    chartData: {
      series: [tradeSeries, bidSeries, askSeries],
    },
  };
};
