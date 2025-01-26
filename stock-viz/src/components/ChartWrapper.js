import React from "react";
import Chart from "react-apexcharts";

const ChartWrapper = ({ title, chartData }) => {
  return (
    <div>
      <h2>{title}</h2>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default ChartWrapper;
