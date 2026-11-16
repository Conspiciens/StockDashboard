import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { data, useParams } from 'react-router-dom';

import initWebSocket from '../services/websocket';
import type { Trade } from '../types/type.ts';

import * as echarts from 'echarts/core'
import ReactECharts from 'echarts-for-react'

const MAX_POINTS = 10000

const defaultOption = {
      useUTC: false,
      title: {
        text: ``,
        left: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis', 
        position: function (pt: any) {
          return [pt[0], '10%'];
        }
      }, 
      grid: [
        {
          left: 0, 
          height: 800,
          width: '100%',
        },
        {
          // show: true,
          // borderColor: 'purple'
        }
      ],
      toolbox: [
        {
          feature: {
            dataZoom: {
              yAxisIndex: 1
            }
          }
        }
      ], 
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          // interval: 1000 * 60 * 60 * 24, // 30 minutes
          axisLine: {
            onZero: false
          },
          axisLabel: {
            showMinLabel: true,
            showMaxLabel: true,
          },
          breakLabelLayout: {
            // Disable auto move of break labels if overlapping,
            // and use `axisLabel.formatter` to control the label display.
            moveOverlap: true 
          },
          animation: false, 
        }
      ],
      yAxis: {
        type: 'value',
        min: 'dataMin', 
        boundaryGap: [0, '100%'], 
        animation: false
      },
      dataZoom: [
        {
          // yAxisIndex: 1,
          type: 'inside',
          // start: Math.max(0, data.length - 100), 
          // end: data.length - 1
          rangeMode: ['value', 'value']
        }
      ],
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
          showSymbol: false, 
          data: [] as any
        },
      ], 
      animation: false, 
}

function Dashboard() {
  let params = useParams();

  const eChartsRef = useRef<InstanceType<typeof ReactECharts>>(null);
  const [message, setMessage] = useState<(string | number)[]>([]);

  defaultOption.title.text = params.tickSymbol || ''; 
  initWebSocket(
    params.tickSymbol, 
    setMessage 
  );

  const loadLatestTrades = async() => {
    if (eChartsRef.current == null) 
      return;

    const eChartsInstance = eChartsRef.
      current.getEchartsInstance(); 

    try { 
      const response = await fetch(`http://127.0.0.1:8000/latest_trades/${params.tickSymbol}`)
      if (!response.ok) {
        throw Error("Failed to get response");
      }

      const trades: Trade[] = await response.json();

      const timePriceTrades = trades.map(({p, t}) => ([t, p]))
      defaultOption.series[0]
        .data = timePriceTrades;
      eChartsInstance.setOption(defaultOption);
    } catch (err) {
      console.log(`Error occured when fetching initial trades: ${err}`);
    }
  }

  useEffect(() => {
    loadLatestTrades();
  }, [])

  useEffect(() => {
    if (eChartsRef.current == null) 
      return;

    const eChartsInstance = eChartsRef.
      current.getEchartsInstance(); 

    if (message.length == 0)
      return

    /* 
      Update the EChart options, checks whether it's reaching the max points 
    */
    if (defaultOption.series[0].data.length < MAX_POINTS) {
      defaultOption.series[0]
        .data.push(message);
    } else {
      defaultOption.series[0]
        .data.shift(); 
      defaultOption.series[0]
        .data.push(message);
    }

    /* Maintain the zoom the user has manipluated */
    let settings = eChartsInstance.getOption(); 
    const currentZoom = settings.dataZoom[0];
    defaultOption.dataZoom[0] = currentZoom;

    eChartsInstance.setOption(defaultOption);

    return () => {
    }
  }, [message])


  return (
    <>
      <ReactECharts
        ref={eChartsRef}
        title={params.tickSymbols}
        option={defaultOption}
        notMerge={true}
        lazyUpdate={false}
        theme={"theme_name"}
      />
    </>
  )
}


export default Dashboard;