import React, { useState, useEffect } from "react";
import ChartWrapper from "./components/ChartWrapper";
import Dropdown from "./components/Dropdown";
import { fetchOptions, fetchStockData } from "./utils/api";

const App = () => {
  const [tradeData, setTradeData] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedStock, setSelectedStock] = useState("");

  useEffect(() => {
    const getOptions = async () => {
      try {
        const { periods, stocks } = await fetchOptions();
        setPeriods(periods);
        setStocks(stocks);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    getOptions();
  }, []);

  useEffect(() => {
    const getStockData = async () => {
      if (selectedPeriod && selectedStock) {
        try {
          const { chartData } = await fetchStockData(
            selectedPeriod,
            selectedStock
          );
          setTradeData(chartData.series.find((s) => s.name === "Trade"));
          setMarketData(chartData.series.filter((s) => s.name !== "Trade"));
        } catch (error) {
          console.error("Error fetching stock data:", error);
        }
      }
    };
    getStockData();
  }, [selectedPeriod, selectedStock]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stock Visualizer</h1>
      <div style={{ marginBottom: "20px" }}>
        <Dropdown
          label="Select Period:"
          options={periods}
          value={selectedPeriod}
          onChange={setSelectedPeriod}
        />
        <Dropdown
          label="Select Stock:"
          options={stocks}
          value={selectedStock}
          onChange={setSelectedStock}
        />
      </div>
      {tradeData && tradeData.data && (
        <ChartWrapper
          title={`Trade Data for ${selectedStock} in ${selectedPeriod}`}
          chartData={{
            series: [tradeData],
            options: {
              chart: { type: "line", height: 350 },
              xaxis: { type: "datetime" },
            },
          }}
        />
      )}
      {marketData && marketData.length > 0 && (
        <ChartWrapper
          title={`Market Data for ${selectedStock} in ${selectedPeriod}`}
          chartData={{
            series: marketData,
            options: {
              chart: { type: "line", height: 350 },
              xaxis: { type: "datetime" },
              colors: ["#0000FF", "#FF0000"], // Blue (Bid), Red (Ask)
            },
          }}
        />
      )}
    </div>
  );
};

export default App;
