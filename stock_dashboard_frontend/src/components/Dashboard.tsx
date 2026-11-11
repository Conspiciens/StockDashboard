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
        show: true,
        trigger: 'axis', 
        position: function (pt: any) {
          return [pt[0], '10%'];
        }
      }, 
      grid: [
        {
          height: '100%',
          width: '50%',
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
          yAxisIndex: 1,
          type: 'inside',
          start: 0, 
          end: 0.1
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
    // if (defaultOption.series[0].data.size() > 100)
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