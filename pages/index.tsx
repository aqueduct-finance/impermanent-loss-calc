import { useEffect, useState } from 'react'
import ethPriceData from '../data/ethPriceData.json';

export default function Home() {

  const [uniIL, setUniIL] = useState('-');
  const [aqIL, setAqIL] = useState('-');

  useEffect(() => {
    const data = ethPriceData;
    const lpFlowA = 1;
    const lpFlowB = 135.44;
    //const initialRebalanceIndex = Math.floor(data.length / 4);

    // calculate LP value
    var avgPriceA = 0;
    var avgPriceB = 0;
    const lpStartTimestamp = data.at(0)!.timestamp - 1;
    var timestampLast = lpStartTimestamp;
    // TODO: add rebalance logic:
    //var totalAvgPriceA = 0;
    //var totalAvgPriceB = 0;
    //var rebalanceIndex = initialRebalanceIndex;
    data.forEach((d, i) => {
      avgPriceA += d.price * (d.timestamp - timestampLast);
      avgPriceB += (1 / d.price) * (d.timestamp - timestampLast);
      timestampLast = d.timestamp;

      // TODO: add rebalance logic:
      // if needed, rebalance LP position
      /*if (i == rebalanceIndex) {
        rebalanceIndex += initialRebalanceIndex;
        totalAvgPriceA = 
      }*/
    });

    const lpValue = (lpFlowA * avgPriceA) + (lpFlowB * avgPriceB * data.at(-1)!.price)

    // calculate held value
    const deltaT = data.at(-1)!.timestamp - lpStartTimestamp;
    const heldValue = (lpFlowA * deltaT * data.at(-1)!.price) + (lpFlowB * deltaT);
    setAqIL(
      (((lpValue - heldValue) / heldValue) * 100).toString() + ' %'
    );

    // uniswap IL is calculated just on beginning and end prices
    const k = data.at(-1)!.price / data.at(0)!.price;
    setUniIL(
      ((((2 * Math.sqrt(k)) / (1 + k)) - 1) * 100).toString() + ' %'
    );
  }, [])

  return (
    <div className='flex flex-col space-y-8 items-center justify-center w-full h-screen'>
      <p>
        {'Uniswap Impermanent Loss: ' + uniIL}
      </p>
      <p>
        {'Aqueduct Impermanent Loss: ' + aqIL}
      </p>
    </div>
  )
}

