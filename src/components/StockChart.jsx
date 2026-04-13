import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from "lightweight-charts";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import "../css/StockChart.css";

const maPeriods = [7, 30, 60, 90];

// ✅ Moving Average
const calculateMA = (data, period) => {
  return data
    .map((d, i) => {
      if (i < period - 1) return null;

      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, x) => sum + x.close, 0) / period;

      return {
        time: d.time,
        value: avg,
      };
    })
    .filter(Boolean);
};

// ✅ Timeframe filter
const filterData = (data, timeframe) => {
  switch (timeframe) {
    case "5D":
      return data.slice(-5);
    case "1W":
      return data.slice(-7);
    case "1M":
      return data.slice(-30);
    case "3M":
      return data.slice(-90);
    default:
      return data;
  }
};

function StockChart({ data }) {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const chartInstance = useRef(null);
  const seriesRef = useRef({});
  const resizeObserverRef = useRef(null);
  const dataRef = useRef([]);

  const [timeframe, setTimeframe] = useState("1M");
  const [enabledMA, setEnabledMA] = useState([]);

  // ✅ Chart Creation Effect
  useEffect(() => {
    if (!data || data.length === 0) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#0f172a" },
        textColor: "#ccc",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#444" },
      timeScale: {
        borderColor: "#444",
        timeVisible: true,
      },
    });

    chartInstance.current = chart;

    // ✅ Full dataset (for MA)
    const fullFormatted = data.map((d) => ({
      time: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    // ✅ Filtered dataset
    const filteredRaw = filterData(data, timeframe);
    dataRef.current = filteredRaw;

    const formatted = filteredRaw.map((d) => ({
      time: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    // 📊 Candlestick
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#00e676",
      downColor: "#ff5252",
      borderVisible: false,
      wickUpColor: "#00e676",
      wickDownColor: "#ff5252",
    });

    candleSeries.setData(formatted);

    // 📉 Volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    const volumeData = filteredRaw.map((d) => ({
      time: d.date,
      value: Number(d.volume) || 0,
      color:
        d.close >= d.open ? "rgba(0, 230, 118, 0.6)" : "rgba(255, 82, 82, 0.6)",
    }));

    volumeSeries.setData(volumeData);

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // 📈 MA Series (initially hidden)
    const maSeriesMap = {};

    maPeriods.forEach((period) => {
      const maFull = calculateMA(fullFormatted, period);

      // safer alignment
      const visibleTimes = new Set(formatted.map((d) => d.time));
      const maVisible = maFull.filter((d) => visibleTimes.has(d.time));

      const series = chart.addSeries(LineSeries, {
        color:
          period === 7
            ? "#ff9800"
            : period === 30
              ? "#2196f3"
              : period === 60
                ? "#9c27b0"
                : "#f44336",
        lineWidth: 2,
        visible: false, // 🔥 handled separately
      });

      series.setData(maVisible);
      maSeriesMap[period] = series;
    });

    seriesRef.current = maSeriesMap;

    chart.timeScale().fitContent();

    // ✅ Tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!tooltipRef.current) return;

      if (
        !param ||
        !param.time ||
        !param.point ||
        param.point.x < 0 ||
        param.point.y < 0
      ) {
        tooltipRef.current.style.display = "none";
        return;
      }

      const candleData =
        param.seriesPrices?.get?.(candleSeries) ||
        param.seriesData?.get?.(candleSeries);

      if (!candleData) {
        tooltipRef.current.style.display = "none";
        return;
      }

      const hovered = dataRef.current.find((d) => d.date === param.time);
      const volume = hovered ? Number(hovered.volume) : null;

      const { open, high, low, close } = candleData;

      tooltipRef.current.innerHTML = `
        <div><strong>${param.time}</strong></div>
        <div>O: ${open.toFixed(2)}</div>
        <div>H: ${high.toFixed(2)}</div>
        <div>L: ${low.toFixed(2)}</div>
        <div>C: ${close.toFixed(2)}</div>
        <div>Vol: ${
          volume && !isNaN(volume) ? volume.toLocaleString() : "-"
        }</div>
      `;

      tooltipRef.current.style.display = "block";
      tooltipRef.current.style.left = param.point.x + 15 + "px";
      tooltipRef.current.style.top = param.point.y + 15 + "px";
    });

    // Resize
    resizeObserverRef.current = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      chart.applyOptions({ width });
    });

    resizeObserverRef.current.observe(chartRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (chartInstance.current) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [data, timeframe]);

  // ✅ MA Visibility Effect (FIXED)
  useEffect(() => {
    if (!seriesRef.current) return;

    maPeriods.forEach((period) => {
      const series = seriesRef.current[period];
      if (!series) return;

      series.applyOptions({
        visible: enabledMA.includes(period),
      });
    });
  }, [enabledMA]);

  // ✅ Toggle handler (clean)
  const handleToggle = (period) => {
    setEnabledMA((prev) =>
      prev.includes(period)
        ? prev.filter((p) => p !== period)
        : [...prev, period],
    );
  };

  return (
    <Box className="stock-chart-container">
      {/* Chart */}
      <div className="stock-chart-wrapper">
        <div className="tooltip" ref={tooltipRef} />
        <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Controls */}
      <Box className="stock-chart-controls">
        {/* Timeframe */}
        <div className="timeframe-buttons">
          {["5D", "1W", "1M", "3M"].map((tf) => (
            <button
              key={tf}
              className={timeframe === tf ? "active" : ""}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* MA */}
        <div className="ma-ops">
          {maPeriods.map((p) => (
            <FormControlLabel
              key={p}
              control={
                <Checkbox
                  checked={enabledMA.includes(p)}
                  onChange={() => handleToggle(p)}
                  sx={{ color: "#aaa" }}
                />
              }
              label={`MA${p}`}
            />
          ))}
        </div>
      </Box>
    </Box>
  );
}

export default StockChart;
