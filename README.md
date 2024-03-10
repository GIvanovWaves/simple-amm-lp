# Simple AMM Liquidity Pool

## What is this?
This is simple AMM LP contract and frontend for Waves Blockchain. 
Without bell and whistles, it just works.

Contract uses Uniswap [CFMM](https://en.wikipedia.org/wiki/Constant_function_market_maker) formula.


Contract: [XXX](https://wavesexplorer.com/addresses/XXX)

Frontend: [Simple-AMM-LP](https://givanovwaves.github.io/simple-amm-lp/)

| asset                                                                                 |                                        assetId |
| :------------------------------------------------------------------------------------ | ---------------------------------------------: |
| [WAVES](https://wavesexplorer.com/assets/WAVES)                                       |                                        `WAVES` |
| [USDT](https://wavesexplorer.com/assets/G5WWWzzVsWRyzGf32xojbnfp7gXbWrgqJT8RcVWEfLmC) | `G5WWWzzVsWRyzGf32xojbnfp7gXbWrgqJT8RcVWEfLmC` |


## Why?
- More markets is always better;
- You can arbitrage between different markets (swop.fi, WX pools, WX Spot etc.);
- Can be integrated into onchain arbitrage contracts;
- Single `InvokeTx`;
- No hidden fees, lp tokens or other complexities;
- Just 0.2% fee;
- Open source.
