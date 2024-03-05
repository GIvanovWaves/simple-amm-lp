import React from "react";

import { useState } from 'react';
import { Signer } from "@waves/signer";
import { ProviderWeb } from "@waves.exchange/provider-web";
import { ProviderKeeper } from "@waves/provider-keeper";
// import { ProviderCloud } from "@waves.exchange/provider-cloud";

import { ProviderButton } from "./components/providerButton";
import { MainForm } from "./components/mainForm";
import { UserInfo } from "./components/userInfo";

export default function MyApp() {
  const [userData, setUserData] = useState({ address: null, publicKey: null })

  var config = {
    wxUrl: "https://wx.network",
    // nodeUrl: "https://nodes.wx.network",
    nodeUrl: "https://nodes-testnet.wx.network",
    explorer: "https://wavesexplorer.com",
    dApp: "3N61RYWc9QuqKUwLvowpZZLpgUnqpQSFwLq",
    usdt: {
      id: "Atqv59EYzjFGuitKVnMRk6H8FukjoV3ktPorbEys25on",
      decimals: 6
    },
    waves: {
      decimals: 8
    }
  }

  var signer = null
  var providerWeb = null
  var providerKeeper = null

  function initSigner() {
    return new Signer({
      NODE_URL: config.nodeUrl,
    })
  }

  function loginSigner() {
    signer.login()
      .then((acc) => {
        setUserData({ address: acc.address, publicKey: acc.publicKey })
      })
      .catch(err => console.log(err))
  }

  function initProviderWeb() {
    const wxUrlObj = new URL(config.wxUrl)
    providerWeb = new ProviderWeb(wxUrlObj.origin + '/signer')
    signer = initSigner()
    signer.setProvider(providerWeb)
    loginSigner()
  }

  function initKeeper() {
    providerKeeper = new ProviderKeeper()
    signer = initSigner()
    signer.setProvider(providerKeeper)
    loginSigner()
  }

  return (
    <div>
      <ProviderButton providerName="WEB" userData={userData} loginFunc={initProviderWeb} />
      <ProviderButton providerName="KEEPER" userData={userData} loginFunc={initKeeper} />
      <UserInfo userData={userData} config={config} />
      <MainForm config={config} />
    </div>
  )
}
