import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [differenceData, setDifferenceData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [period, setPeriod] = useState("");
  const [stock, setStock] = useState("");

  // Fetch available periods and stocks from the backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/options");
        setPeriods(response.data.periods); // e.g., ["Period1", "Period2", ...]
        setStocks(response.data.stocks);   // e.g., ["A", "B", "C", ...]
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  // Fetch data whenever period or stock changes
  useEffect(() => {
    if (period && stock) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/api/period/${period}/stock/${stock}`
          );
          const data = response.data;
  
          // Prepare data for ApexCharts
          const timestamps = data.map((item) => new Date(item.timestamp).getTime()); // Convert to Unix timestamp
          const tradePrices = data.map((item) => item.price);
          const bidPrices = data.map((item) => item.bidPrice);
          const askPrices = data.map((item) => item.askPrice);
  
          // Compute Trade-Bid and Trade-Ask differences
          const tradeBidDiff = tradePrices.map((trade, index) => trade - bidPrices[index]);
          const tradeAskDiff = tradePrices.map((trade, index) => trade - askPrices[index]);
  
          setChartData({
            series: [
              { name: "Trade", data: timestamps.map((t, i) => [t, tradePrices[i]]) },
              { name: "Bid", data: timestamps.map((t, i) => [t, bidPrices[i]]) },
              { name: "Ask", data: timestamps.map((t, i) => [t, askPrices[i]]) },
            ],
            options: {
              chart: {
                type: "line",
                height: 350,
              },
              xaxis: {
                type: "datetime", // Ensure proper handling of timestamps
              },
              colors: ["#808080", "#0000FF", "#FF0000"], // Grey, Blue, Red
              stroke: {
                width: 2,
              },
              title: {
                text: `Stock Data for ${stock} in ${period}`,
                align: "center",
              },
            },
          });
  
          setDifferenceData({
            series: [
              { name: "Trade-Bid", data: timestamps.map((t, i) => [t, tradeBidDiff[i]]) },
              { name: "Trade-Ask", data: timestamps.map((t, i) => [t, tradeAskDiff[i]]) },
            ],
            options: {
              chart: {
                type: "line",
                height: 350,
              },
              xaxis: {
                type: "datetime", // Ensure proper handling of timestamps
              },
              colors: ["#FFA500", "#800080"], // Orange, Purple
              stroke: {
                width: 2,
              },
              title: {
                text: `Price Differences for ${stock} in ${period}`,
                align: "center",
              },
            },
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [period, stock]);
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stock Visualizer</h1>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Select Period:
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Select Period --
            </option>
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: "10px" }}>
          Select Stock:
          <select
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Select Stock --
            </option>
            {stocks.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      {chartData.series && (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      )}
      {differenceData.series && (
        <Chart
          options={differenceData.options}
          series={differenceData.series}
          type="line"
          height={350}
        />
      )}
    </div>
  );
};

export default App;
