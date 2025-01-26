import React, { useState, useEffect } from "react";
import ChartWrapper from "./components/ChartWrapper";
import Dropdown from "./components/Dropdown";
import { fetchOptions, fetchStockData } from "./utils/api";

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [differenceData, setDifferenceData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [period, setPeriod] = useState("");
  const [stock, setStock] = useState("");

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
      if (period && stock) {
        try {
          const { chartData, differenceData } = await fetchStockData(period, stock);
          setChartData(chartData);
          setDifferenceData(differenceData);
        } catch (error) {
          console.error("Error fetching stock data:", error);
        }
      }
    };
    getStockData();
  }, [period, stock]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stock Visualizer</h1>
      <div style={{ marginBottom: "20px" }}>
        <Dropdown
          label="Select Period:"
          options={periods}
          value={period}
          onChange={setPeriod}
        />
        <Dropdown
          label="Select Stock:"
          options={stocks}
          value={stock}
          onChange={setStock}
        />
      </div>
      {chartData.series && (
        <ChartWrapper
          title={`Stock Data for ${stock} in ${period}`}
          chartData={chartData}
        />
      )}
      {differenceData.series && (
        <ChartWrapper
          title={`Price Differences for ${stock} in ${period}`}
          chartData={differenceData}
        />
      )}
    </div>
  );
};

export default App;
