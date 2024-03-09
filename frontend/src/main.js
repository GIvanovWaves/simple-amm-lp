import React from 'react'

import { useState } from 'react'
import { Signer } from '@waves/signer'
import { ProviderWeb } from '@waves.exchange/provider-web'
import { ProviderKeeper } from '@waves/provider-keeper'
import { ProviderCloud } from '@waves.exchange/provider-cloud'
import { ProviderMetamask } from '@waves/provider-metamask'

import { ProviderButton } from './components/providerButton'
import { MainForm } from './components/mainForm'
import { UserInfo } from './components/userInfo'

import './components/componentStyles.css'

export default function MyApp() {
  const [userData, setUserData] = useState({ address: null, publicKey: null })

  var config = {
    // wxUrl: 'https://wx.network',
    wxUrl: 'https://testnet.wx.network',
    // nodeUrl: 'https://nodes.wx.network',
    nodeUrl: 'https://nodes-testnet.wx.network',
    explorerUrl: 'https://wavesexplorer.com',
    network: 'testnet',
    dApp: '3N61RYWc9QuqKUwLvowpZZLpgUnqpQSFwLq',
    usdt: {
      // id: 'Atqv59EYzjFGuitKVnMRk6H8FukjoV3ktPorbEys25on',
      id: '25FEqEjRkqK6yCkiT7Lz6SAYz7gUFCtxfCChnrVFD5AT',
      decimals: 6,
      ticker: 'USDT',
    },
    waves: {
      id: 'WAVES',
      decimals: 8,
      ticker: 'WAVES',
    }
  }

  const [signer, setSigner] = useState(null)
  const [error, setError] = useState(null)

  function initSigner() {
    return new Signer({
      NODE_URL: config.nodeUrl,
    })
  }

  function loginSigner(signer) {
    signer.login()
      .then((acc) => {
        setSigner(signer)
        setUserData({ address: acc.address, publicKey: acc.publicKey })
        setError(null)
      })
      .catch(err => setError(err))
  }

  function initProviderWeb() {
    const wxUrlObj = new URL(config.wxUrl)
    const providerWeb = new ProviderWeb(wxUrlObj.origin + '/signer')
    const signer = initSigner()
    signer.setProvider(providerWeb)
    loginSigner(signer)
  }

  function initProviderCloud() {
    const wxUrlObj = new URL(config.wxUrl)
    const providerCloud = new ProviderCloud(wxUrlObj.origin + '/signer-cloud' + wxUrlObj.search)
    const signer = initSigner()
    signer.setProvider(providerCloud)
    loginSigner(signer)
  }

  function initKeeper() {
    const providerKeeper = new ProviderKeeper()
    const signer = initSigner()
    signer.setProvider(providerKeeper)
    loginSigner(signer)
  }

  function initMetamask() {
    try {
      const providerMetamask = new ProviderMetamask()
      const signer = initSigner()
      signer.setProvider(providerMetamask)
      loginSigner(signer)
    } catch {
      setError('Metamask not found')
    }
  }

  function Err() {
    if (error) {
      return <div className='Error'>{error}</div>
    }
  }

  return (
    <div className='main'>
      <div className={userData.address ? '' : 'providers-block'}>
        <ProviderButton
          providerName='WX'
          logoPath='./imgs/wx-seed.png'
          userData={userData}
          loginFunc={initProviderWeb} />
        <ProviderButton
          providerName='WX-EMAIL'
          logoPath='./imgs/wx-email.png'
          userData={userData}
          loginFunc={initProviderCloud} />
        <ProviderButton
          providerName='KEEPER'
          logoPath='./imgs/keeper.png'
          userData={userData}
          loginFunc={initKeeper} />
        <ProviderButton
          providerName='METAMASK'
          logoPath='./imgs/metamask.png'
          userData={userData}
          loginFunc={initMetamask} />
      </div>
      <Err />
      <UserInfo userData={userData} config={config} />
      <MainForm config={config} userData={userData} signer={signer} />
    </div>
  )
}