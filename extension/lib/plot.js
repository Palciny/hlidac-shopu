/* global Chart */

Chart.plugins.register({
  afterDraw: function(chart) {
    if (chart.data.datasets.every(set => set.data.length == 0)) {
      // No data is present
      var ctx = chart.chart.ctx;
      var width = chart.chart.width;
      var height = chart.chart.height;
      // chart.clear();

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "16px normal 'Helvetica Nueue'";
      ctx.fillText("Chybí data", width / 2, height / 2);
      ctx.restore();
    }
  }
});

/* exported plot */
function plot(canvas, prices) {
  const values = prices.currentPrice.filter(p => p.y !== null).map(p => p.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const ctx = canvas.getContext("2d");

  const count = prices.currentPrice.length;
  const stepSize = Math.floor(count / 12) || 1;

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: prices.currentPrice.map(p => p.x),
      datasets: [
        {
          label: "Uváděná původní cena",
          steppedLine: "after",
          borderColor: "#5C62CD",
          borderWidth: 2,
          borderCapStyle: "round",
          fill: false,
          backgroundColor: "#ffffff00",
          pointRadius: 0,
          spanGaps: false,
          data: prices.originalPrice,
        },
        {
          label: "Doplněná prodejní cena",
          steppedLine: "after",
          borderColor: "#EB6F55",
          borderWidth: 1,
          borderDash: [5, 10],
          borderCapStyle: "round",
          fill: false,
          backgroundColor: "#ffffff00",
          pointRadius: 0,
          spanGaps: true,
          data: prices.currentPrice,
        },
        {
          label: "Prodejní cena",
          steppedLine: "after",
          borderColor: "#EB6F55",
          borderWidth: 2,
          borderCapStyle: "round",
          fill: false,
          backgroundColor: "#ffffff00",
          pointRadius: 0,
          spanGaps: false,
          data: prices.currentPrice,
        }
      ]
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        mode: "index",
        intersect: false,
        backgroundColor: "#FCF4A7",
        borderColor: "#FBEA61",
        borderWidth: 2,
        bodyFontColor: "#1D3650",
        bodySpacing: 4,
        titleFontColor: "#1D3650",
        xPadding: 12,
        yPadding: 8,
        caretSize: 12,
        callbacks: {
          title(item, data) {
            const date = data.labels[item[0].index];
            return date.toLocaleDateString("cs", { day: "numeric", month: "long", year: "numeric" });
          },
          label(item, _data) {
            if (item.datasetIndex === 0) {
              return `Uváděná původní cena: ${item.yLabel.toLocaleString("cs")},- Kč`;
            }
            else if (item.datasetIndex === 1) {
              return `Prodejní cena: ${item.yLabel.toLocaleString("cs")},- Kč`;
            }
          },
          labelColor(item, _chart) {
            const red = "#FF8787";
            const blue = "#5C62CD";
            const color = item.datasetIndex > 0 ? red : blue;

            return {
              borderColor: color,
              backgroundColor: color,
            };
          },
        }
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: "day",
            stepSize,
            displayFormats: {
              day: "D.M.YYYY"
            }
          },
        }],
        yAxes: [{
          ticks: {
              suggestedMax: max + 0.1 * max,
              suggestedMin: min - 0.1 * min,
          }
        }]
      }
    },
  });
}
