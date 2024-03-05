import { nodeInteraction } from "@waves/waves-transactions"
import { useState } from "react"
import './componentStyles.css'

export function UserInfo({ userData, config }) {
  const [balance, setBalance] = useState({ usdt: 0, waves: 0 })

  function getBalance() {
    var usdtBal, wavesBal

    nodeInteraction.assetBalance(config.usdt.id, userData.address, config.nodeUrl)
      .then(res => usdtBal = res)
      .then(res => nodeInteraction.balanceDetails(userData.address, config.nodeUrl)
        .then(res => wavesBal = res.effective))
      .then(res => setBalance({
        usdt: usdtBal / Math.pow(10, config.usdt.decimals),
        waves: wavesBal / Math.pow(10, config.waves.decimals),
      }))
  }

  if (userData.address) {
    return (
      <div className="user-info">
        <div>
          <div>Address: {userData.address}</div>
          <div>Public Key: {userData.publicKey}</div>
          <br />
          <div>WAVES: {balance.waves}</div>
          <div>USDT: {balance.usdt}</div>
          <button onClick={getBalance}>Get balance</button>
        </div>
      </div >
    );
  } else {
    return null;
  }
}