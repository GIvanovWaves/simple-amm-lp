import { useEffect, useState } from 'react'

import './componentStyles.css'

export function MainForm({ config }) {
  const link = `${config.explorer}/addresses/${config.dApp}`
  const [price, setPriceValue] = useState(0)
  const [amount, setAmount] = useState(1)
  const [priceAmount, setPriceAmount] = useState(0)

  async function getPrice(amountRaw, decimals) {
    const amount = amountRaw * Math.pow(10, decimals)
    const reqUrl = `${config.nodeUrl}/utils/script/evaluate/${config.dApp}`
    const expr = `{"expr": "calcSendAmount(unit, ${amount}, true)"}`
    const reqOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expr,
    }
    let data = await fetch(reqUrl, reqOptions)
      .then(async res => {
        const json = await res.json()
        let getAmount = json.result.value._1.value
        let price = json.result.value._4.value
        return { getAmount, price }
      })
    return data
  }

  async function calcFromAmount(amount) {
    let data = await getPrice(amount, config.waves.decimals)
    setPriceAmount(data.getAmount / Math.pow(10, config.usdt.decimals))
    setPriceValue(data.price / Math.pow(10, config.usdt.decimals))
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => calcFromAmount(amount), 500);
    return () => clearTimeout(timeOutId);
  }, [amount])

  return (
    <div className="main-form">
      <div>
        dApp: <a href={link} target="_blank">{config.dApp}</a>
      </div>
      <div>
        Price: {price}
      </div>
      <div className='form-inputs'>
        <label>Waves:       
          <input
            autoComplete='false'
            id="amount-input"
            className="form-input"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </label>
        <label>USDT: 
          <input
            id="price-input"
            className="form-input"
            value={priceAmount}
            readOnly
          />
        </label>
      </div>
    </div>
  );
}