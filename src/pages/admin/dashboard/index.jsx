import { useEffect, memo, useRef, useMemo } from "react";
import { Pie } from "@ant-design/plots";
import { Flex } from "antd";
import Chart from "chart.js/auto";

import "./style.scss";

const DashboardPage = () => {
  const data = [
    {
      type: "Users",
      value: 123,
    },
    {
      type: "Skills",
      value: 34,
    },
    {
      type: "Portfolio",
      value: 43,
    },
    {
      type: "Experinensec",
      value: 55,
    },
    {
      type: "Education",
      value: 100,
    },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const xValues = useMemo(
    () => ["Users", "Skills", "Portfolios", "Experinensec", "Education"],
    []
  );
  const yValues = useMemo(() => [123, 34, 43, 55, 100], []);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          {
            backgroundColor: [
              "rgba(0,0,255,1.0)",
              "rgba(0,255,0,1.0)",
              "rgba(255,0,0,1.0)",
            ],
            borderColor: "rgba(0,0,0,0.1)",
            data: yValues,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }, [xValues, yValues]);

  return (
    <div>
      <Flex justify="space-between" align="center" wrap="wrap">
        {/* <h1>Categries: </h1>
        <h1>Posts: </h1>
        <h1>Users: </h1> */}
      </Flex>

      <div style={{ width: "100%" }}>
        <canvas style={{ width: "100%" }} id="myChart" ref={chartRef}></canvas>
      </div>

      <Pie {...config} />
    </div>
  );
};

const MemoDashboardPage = memo(DashboardPage);

export default MemoDashboardPage;
