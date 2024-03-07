import { useEffect, useRef, useState } from 'react'

import './componentStyles.css'

export function MainForm({ config, userData, signer }) {
  const link = `${config.explorerUrl}/addresses/${config.dApp}?network=${config.network}`
  const [price, setPriceValue] = useState(0)
  const [inputAmount, setInputAmount] = useState(1)
  const [rawSendAmount, setRawSendAmount] = useState(1)
  const [rawGetAmount, setRawGetAmount] = useState(0)
  const [getAmount, setGetAmount] = useState(0)
  const [assets, setAssets] = useState({ amount: config.waves, price: config.usdt })
  const [txData, setTxData] = useState(null)

  function getEvaluate(amountRaw, token) {
    const amount = parseInt(amountRaw * Math.pow(10, token.decimals))
    const reqUrl = `${config.nodeUrl}/utils/script/evaluate/${config.dApp}`
    const idString = token.id ? `\\"${token.id}\\"` : 'unit'
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
    if (Number(amount) > 0) {
      setGetAmount('Loading...')
      setPriceValue('Loading...')
      getEvaluate(amount, assets.amount).then((data) => {
        setRawGetAmount(data.getAmount)
        setRawSendAmount(amount * Math.pow(10, assets.amount.decimals))
        setGetAmount(data.getAmount / Math.pow(10, assets.price.decimals))
        setPriceValue(data.price / Math.pow(10, 6))
      })
    } else {
      setGetAmount(NaN)
      setPriceValue(NaN)
    }
  }

  function sellWaves() {
    setAssets({ amount: config.waves, price: config.usdt })
  }

  function buyWaves() {
    setAssets({ amount: config.usdt, price: config.waves })
  }

  function swap() {
    setTxData(null)
    const invokeTxData = {
      dApp: config.dApp,
      call: {
        function: 'swapNoLess',
        args: [
          { type: 'integer', value: parseInt(rawGetAmount) }
        ]
      },
      payment: [
        { assetId: assets.amount.id, amount: parseInt(rawSendAmount) }
      ],
      senderPublicKey: userData.publicKey,
    }
    signer.invoke(invokeTxData).broadcast()
      .then((tx) => {
        if (Array.isArray(tx)) {
          setTxData(tx[0])
        } else {
          setTxData(tx)
        }
      })
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => { calcFromAmount(inputAmount) }, 500);
    return () => clearTimeout(timeOutId);
  }, [inputAmount, assets])

  function TxId({ txData }) {
    if (txData) {
      const explorerUrl = `${config.explorerUrl}/transactions/${txData.id}?network=${config.network}`

      return <div>
        TX: <a href={explorerUrl} target='_blank'>{txData.id}</a>
      </div>
    }
  }

  return (
    <div className='main-form'>
      <div>
        dApp: <a href={link} target='_blank'>{config.dApp}</a>
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
            id='amount-input'
            className='form-input'
            value={inputAmount}
            onChange={e => setInputAmount(e.target.value)}
          /> {assets.amount.ticker}
        </div>
        <div>Get: {getAmount.toString()} {assets.price.ticker}</div>
        <button
          className='select-button'
          disabled={!(Number(getAmount) > 0) || !userData.address}
          onClick={swap}
        >Swap</button>
        <TxId txData={txData} />
      </div>
    </div>
  );
}