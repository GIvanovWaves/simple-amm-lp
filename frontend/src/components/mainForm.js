import { useEffect, useRef, useState } from 'react'

import './componentStyles.css'

export function MainForm({ config, userData, signer }) {
  const link = `${config.explorerUrl}/addresses/${config.dApp}?network=${config.network}`
  const [price, setPriceValue] = useState(0)
  const [inputAmount, setInputAmount] = useState(1)
  const [rawSendAmount, setRawSendAmount] = useState(1)
  const [rawGetAmount, setRawGetAmount] = useState(0)
  const [assets, setAssets] = useState({ amount: config.waves, price: config.usdt })
  const [txData, setTxData] = useState(null)
  const [slippage, setSlippage] = useState(0)
  const [rawGetWithSlippage, setRawGetWithSlippage] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)

  function getEvaluate(amountRaw, token) {
    const sendAmount = parseInt(amountRaw * Math.pow(10, token.decimals))
    const reqUrl = `${config.nodeUrl}/utils/script/evaluate/${config.dApp}`
    const expr = `{"expr": "calcSendAmountREADONLY(\\"${assets.amount.id}\\", ${sendAmount})"}`
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('accept', 'application/json')
    const reqOptions = {
      method: 'POST',
      headers,
      body: expr,
    }
    return fetch(reqUrl, reqOptions)
      .then(res => {
        setErrorMessage(null)
        return res.json().then(json => {
          let getAmount = json.result.value._1.value
          let price = json.result.value._2.value
          return { sendAmount, getAmount, price }
        }).catch((e) => {
          setErrorMessage(e.message)
          return { sendAmount: NaN, getAmount: NaN, price: NaN }
        })
      })
      .catch((e) => {
        setErrorMessage(e.message)
        return { sendAmount: NaN, getAmount: NaN, price: NaN }
      })
  }

  function calcFromAmount(amount) {
    if (Number(amount) > 0) {
      getEvaluate(amount, assets.amount).then((data) => {
        setRawSendAmount(data.sendAmount)
        setRawGetWithSlippage(parseInt(data.getAmount * (1 - parseFloat(slippage))))
        setRawGetAmount(data.getAmount)
        setPriceValue(data.price / Math.pow(10, 6))
      })
    } else {
      setRawSendAmount(NaN)
      setPriceValue(NaN)
      setRawGetAmount(NaN)
      setRawGetWithSlippage(NaN)
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
    setErrorMessage(null)
    const invokeTxData = {
      dApp: config.dApp,
      call: {
        function: 'swapNoLess',
        args: [
          { type: 'integer', value: parseInt(rawGetWithSlippage) }
        ]
      },
      payment: [
        { assetId: assets.amount.id, amount: parseInt(rawSendAmount) }
      ],
      senderPublicKey: userData.publicKey,
    }
    signer.invoke(invokeTxData).broadcast()
      .catch((e) => {
        console.log(e)
        setErrorMessage(e.message)
      })
      .then((tx) => {
        if (Array.isArray(tx)) {
          setTxData(tx[0])
        } else {
          setTxData(tx)
        }
      })
  }

  useEffect(() => {
    setPriceValue('Loading...')
    setRawGetAmount(0)
    setRawGetWithSlippage(0)
    const timeOutId = setTimeout(() => { calcFromAmount(inputAmount) }, 500);
    return () => clearTimeout(timeOutId);
  }, [inputAmount, assets, slippage])

  function TxId({ txData }) {
    if (txData) {
      const explorerUrl = `${config.explorerUrl}/transactions/${txData.id}?network=${config.network}`

      return <div>
        TX: <a href={explorerUrl} target='_blank'>{txData.id}</a>
      </div>
    }
  }

  function ErrorBlock() {
    if (errorMessage) {
      return <div>
        Error: {errorMessage}
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
        Price: {price} {config.usdt.ticker}
      </div>
      <div className='form-inputs'>
        <div>Send:
          <input
            autoComplete='false'
            className='form-input'
            value={inputAmount}
            onChange={e => setInputAmount(e.target.value)}
          /> {assets.amount.ticker}
        </div>
        <div>Get: {(rawGetAmount / Math.pow(10, assets.price.decimals)).toString()} {assets.price.ticker}</div>
        <div>Get at least: {(rawGetWithSlippage / Math.pow(10, assets.price.decimals)).toString()} {assets.price.ticker}</div>
        <div>Slippage:
          <select
            className='form-input'
            onChange={e => setSlippage(e.target.value)}>
            <option value={0}>0%</option>
            <option value={0.005}>0.5%</option>
            <option value={0.01}>1%</option>
            <option value={0.02}>2%</option>
          </select>
        </div>
        <button
          className='select-button'
          disabled={!(Number(rawGetWithSlippage) > 0) || !userData.address}
          onClick={swap}
        >Swap</button>
        <TxId txData={txData} />
        <ErrorBlock />
      </div>
    </div>
  );
}