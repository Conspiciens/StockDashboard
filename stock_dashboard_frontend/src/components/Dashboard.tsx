import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { data, useParams } from 'react-router-dom';

import initWebSocket from '../services/websocket';

import * as echarts from 'echarts/core'
import ReactECharts from 'echarts-for-react'

const defaultOption = {
      useUTC: false,
      title: {
        text: ``,
        left: 'center'
      },
      tooltip: {
        show: false,
        trigger: 'axis'
      }, 
      xAxis: [
        {
          type: 'time',
          interval: 1000 * 60 * 60 * 24, // 30 minutes
          axisLabel: {
            showMinLabel: true,
            showMaxLabel: true,
          },
          breakLabelLayout: {
            // Disable auto move of break labels if overlapping,
            // and use `axisLabel.formatter` to control the label display.
            moveOverlap: false
          },
        }
      ],
      yAxis: {
        type: 'value',
        min: 'dataMin', 
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0
        },
        {
          type: 'slider',
          xAxisIndex: 0
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
          data: [] as any
        },
      ]
}

function Dashboard() {
  let params = useParams();

  const eChartsRef = useRef<InstanceType<typeof ReactECharts>>(null);
  const [message, setMessage] = useState<(string | number)[]>([]);
  initWebSocket(
    params.tickSymbol, 
    setMessage 
  );
  
  useEffect(() => {
    if (eChartsRef.current == null) 
      return;

    const eChartsInstance = eChartsRef.
      current.getEchartsInstance(); 


    if (message.length == 0)
      return

    /* 
      Update the EChart options 
    */
    defaultOption.series[0]
      .data.push(message);
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