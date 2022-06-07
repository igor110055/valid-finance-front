import { widget } from "./charting_library"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  BrowserView,
  MobileView,
} from "react-device-detect";


export default function TradingViewComponent() {

  const Network = useSelector((state) => state.Token.Network);
  const isDark = useSelector((state) => state.Token.isDark);

  const [timeframe, setTimeframe] = useState(15);

  const configurationData = {
    supported_resolutions: ['1', '3', '5', '15', '30', '1h', '2h', '4h', '1D', '1W'],
    exchanges: [{
      value: 'value',
      name: 'name',
      desc: 'desc',
    }
    ],
  };
  const fetchData = async () => {
    const to = (new Date().getTime() / 1000).toFixed(0);
    try {
      const res = await axios.get(`https://api.dex.guru/v1/tradingview/history?symbol=${Network.address}-${Network.network}_USD&resolution=60&from=1644872497&to=${to}&countback=320`);

      console.log('trending/getChartData', res);
      if (res.data) {
        if (res.data.status === 'failed') {
          console.log("getChartData: failed")
        } else {
          let Data = [];
          for (let index = 0; index < res.data.t.length; index++) {
            Data.push({
              time: res.data.t[index],
              low: res.data.l[index],
              high: res.data.h[index],
              open: res.data.o[index],
              close: res.data.c[index]
            })
          }
          setChartData(Data);
        }

      }
    } catch (error) {
      console.log('error', error);
    }
  }
  const [chartData, setChartData] = useState([]);

  useEffect(() => {

    if (Network.address) {
      fetchData();
    }
  }, [Network])

  let Datafeed = {
    onReady: (callback) => {
      setTimeout(() => callback(configurationData));
    },
    resolveSymbol: async (
      symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback,
    ) => {
      var symbolData = {
        ticker: `USD`,
        name: `${Network.name}`,
        description: `${Network.description}`,
        type: "crypto",
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: `${Network.AMM}`,
        minmov: 1,
        pricescale: 1000000000,
        has_intraday: true,
        has_no_volume: true,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
      }
      onSymbolResolvedCallback(symbolData);
    },
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
      const { from, to } = periodParams;
      try {

        let bars = [];
        chartData.forEach(bar => {
          if (bar.time * 1000 >= from * 1000 && bar.time * 1000 < to * 1000) {
            bars = [...bars, {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
            }];
          }
        });

        onHistoryCallback(bars, {
          noData: false,
        });

      } catch (error) {
        onErrorCallback(error);
      }
    },
  }

  useEffect(() => {
    if (chartData.length) {
      window.tvWidget = new widget({
        symbol: 'Bitfinex:BTC/USD', // default symbol
        interval: timeframe, // default interval
        fullscreen: true, // displays the chart in the fullscreen mode
        container: 'tv_chart_container',
        datafeed: Datafeed,
        library_path: './charting_library/',
        theme: 'Dark'
      });
    }
  }, [chartData])

  return (
    <div id="tv_chart_container" className='tradingChart' style={{ width: '100%', height: '100%' }}></div>
  );
}