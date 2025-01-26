import axios from "axios";

export const fetchOptions = async () => {
  const response = await axios.get("http://127.0.0.1:5000/api/options");
  return response.data; // { periods: [...], stocks: [...] }
};

export const fetchStockData = async (period, stock) => {
  const response = await axios.get(
    `http://127.0.0.1:5000/api/period/${period}/stock/${stock}`
  );
  const data = response.data;

  const timestamps = data.map((item) => new Date(item.timestamp).getTime()); // Convert to Unix timestamp
  const tradePrices = data.map((item) => item.price);
  const bidPrices = data.map((item) => item.bidPrice);
  const askPrices = data.map((item) => item.askPrice);

  // Compute Trade-Bid and Trade-Ask differences
  const tradeBidDiff = tradePrices.map((trade, index) => trade - bidPrices[index]);
  const tradeAskDiff = tradePrices.map((trade, index) => trade - askPrices[index]);

  const chartData = {
    series: [
      { name: "Trade", data: timestamps.map((t, i) => [t, tradePrices[i]]) },
      { name: "Bid", data: timestamps.map((t, i) => [t, bidPrices[i]]) },
      { name: "Ask", data: timestamps.map((t, i) => [t, askPrices[i]]) },
    ],
    options: {
      chart: { type: "line", height: 350 },
      xaxis: { type: "datetime" },
      colors: ["#808080", "#0000FF", "#FF0000"], // Grey, Blue, Red
      stroke: { width: 2 },
    },
  };

  const differenceData = {
    series: [
      { name: "Trade-Bid", data: timestamps.map((t, i) => [t, tradeBidDiff[i]]) },
      { name: "Trade-Ask", data: timestamps.map((t, i) => [t, tradeAskDiff[i]]) },
    ],
    options: {
      chart: { type: "line", height: 350 },
      xaxis: { type: "datetime" },
      colors: ["#FFA500", "#800080"], // Orange, Purple
      stroke: { width: 2 },
    },
  };

  return { chartData, differenceData };
};
