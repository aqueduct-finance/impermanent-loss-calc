import { useEffect, useState } from 'react'
import ethPriceData from '../data/ethPriceData.json';
import uniV3EthPriceDataDaily from '../data/uniV3EthPriceDataDaily.json';
import uniV2EthPriceDataDaily from '../data/uniV2EthPriceDataDaily.json';
import uniV3EthPriceDataHourly from '../data/uniV3EthPriceDataHourly.json';

export default function Home() {

  const [uniIL, setUniIL] = useState('-');
  const [aqIL, setAqIL] = useState('-');

  useEffect(() => {
    /* MODIFY THESE TO TEST OTHER DATA: */
    const data = uniV2EthPriceDataDaily;
    const lpFlowA = 1;
    const lpFlowB = 201.49;
    /* -------------------------------- */

    // NOTE: these calculations assume that an LP has enough balance to maintain the above flowrates over the dataset's timespan
    
    // calculate LP value
    var avgPriceA = 0;
    var avgPriceB = 0;
    const lpStartTimestamp = data.at(0)!.timestamp - 1;
    var timestampLast = lpStartTimestamp;
    data.forEach((d, i) => {
      avgPriceA += d.price * (d.timestamp - timestampLast);
      avgPriceB += (1 / d.price) * (d.timestamp - timestampLast);
      timestampLast = d.timestamp;
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

