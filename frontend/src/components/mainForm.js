import { useEffect, useState } from 'react'

import './componentStyles.css'

export function MainForm({ config }) {
  const link = `${config.explorer}/addresses/${config.dApp}`
  const [price, setPriceValue] = useState(0)
  const [amount, setAmount] = useState(1)
  const [priceAmount, setPriceAmount] = useState(0)
  const [assets, setAssets] = useState({ amount: config.waves, price: config.usdt })

  function getEvaluate(amountRaw, token) {
    const amount = parseInt(amountRaw * Math.pow(10, token.decimals))
    const reqUrl = `${config.nodeUrl}/utils/script/evaluate/${config.dApp}`
    const idString = token.id ? `\\"${token.id}\\"` : "unit"
    const expr = `{"expr": "calcSendAmount(${idString}, ${amount}, true)"}`
    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expr,
    }
    return fetch(reqUrl, reqOptions)
      .then(res => {
        return res.json().then(json => {
          let getAmount = json.result.value._1.value
          let price = json.result.value._4.value
          return { getAmount, price }
        })
      })
  }

  function calcFromAmount(amount) {
    if (!Number.isNaN(Number(amount)) && !Number(amount) == 0) {
      setPriceAmount('Loading...')
      setPriceValue('Loading...')
      getEvaluate(amount, assets.amount).then((data) => {
        setPriceAmount(data.getAmount / Math.pow(10, assets.price.decimals))
        setPriceValue(data.price / Math.pow(10, 6))
      })
    } else {
      setPriceAmount(NaN)
      setPriceValue(NaN)
    }
  }

  function sellWaves() {
    setAssets({ amount: config.waves, price: config.usdt })
  }

  function buyWaves() {
    setAssets({ amount: config.usdt, price: config.waves })
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => { calcFromAmount(amount) }, 500);
    return () => clearTimeout(timeOutId);
  }, [amount, assets])

  return (
    <div className="main-form">
      <div>
        dApp: <a href={link} target="_blank">{config.dApp}</a>
      </div>
      <button
        className='select-button'
        onClick={sellWaves}
      >Sell Waves</button>
      <button
        className='select-button'
        onClick={buyWaves}
      >Buy Waves</button>
      <div>
        Price: {price}
      </div>
      <div className='form-inputs'>
        <div>Send:
          <input
            autoComplete='false'
            id="amount-input"
            className="form-input"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          /> {assets.amount.ticker}
        </div>
        <div>Get: {priceAmount.toString()} {assets.price.ticker}
        </div>
      </div>
    </div>
  );
}