import { nodeInteraction } from "@waves/waves-transactions"
import { useEffect, useState } from "react"
import './componentStyles.css'

export function UserInfo({ userData, config }) {
  const [balance, setBalance] = useState({ usdt: 'X', waves: 'X' })

  function getBalance() {
    var usdtBal, wavesBal
    
    setBalance({ usdt: 'Loading...', waves: 'Loading...'})
    nodeInteraction.assetBalance(config.usdt.id, userData.address, config.nodeUrl)
      .then(res => usdtBal = res)
      .then(() => nodeInteraction.balanceDetails(userData.address, config.nodeUrl)
        .then(res => wavesBal = res.effective))
      .then(() => setBalance({
        usdt: usdtBal / Math.pow(10, config.usdt.decimals),
        waves: wavesBal / Math.pow(10, config.waves.decimals),
      }))
  }

  useEffect(() => {
    if(userData.address) {
      getBalance()
    }
  }, [userData])

  if (userData.address) {
    return (
      <div className="user-info">
        <div>
          <div>Address: {userData.address}</div>
          <div>Public Key: {userData.publicKey}</div>
          <div>WAVES: {balance.waves}</div>
          <div>USDT: {balance.usdt}</div>
          <button onClick={getBalance}>Update balance</button>
        </div>
      </div >
    );
  } else {
    return null;
  }
}