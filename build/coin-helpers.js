'use strict';

var _explorerList;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _komodoAssetChains = ['SUPERNET', 'REVS', 'PANGEA', 'PGT', 'DEX', 'JUMBLR', 'BET', 'CRYPTO', 'COQUI', 'HODL', 'MSHARK', 'BOTS', 'MGW', 'MVP', 'KV', 'CEAL', 'MESH', 'WLC', 'AXO', 'ETOMIC', 'BTCH', 'BEER', 'PIZZA', 'OOT', 'NINJA', 'VOTE2018', 'GLXT', 'EQL', 'BNTN', 'PRLPAY', 'CHAIN', 'ZILLA', 'DSEC', 'VRSC', 'MGNX', 'CCL', 'PIRATE', 'KOIN', 'DION', 'KMDICE', 'PTX', 'ZEX', 'SPLTEST', 'LUMBER', 'KSB', 'OUR'];

var _komodoCoins = _komodoAssetChains.concat(['CHIPS', 'KMD', 'KOMODO']);

var isKomodoCoin = function isKomodoCoin(coin, skipKMD) {
  return _komodoCoins.find(function (element) {
    if (skipKMD) {
      return element === coin.toUpperCase() && coin.toUpperCase() !== 'KMD' && coin.toUpperCase() !== 'KOMODO';
    }
    return element === coin.toUpperCase();
  });
};

// TODO: add at least 2 explorers per coin
const explorerList = {
    // list of explorers for supported coins
    // spv
    KMD: 'https://www.kmdexplorer.io/tx/',
    PGT: 'https://explorer.pungotoken.com/tx/',
    SMART: 'https://explorer.smartcash.cc/tx/',
    VRSC: 'https://explorer.veruscoin.io/tx/',
    EQLI: 'http://eql.explorer.dexstats.info/tx/',
    PPC: 'https://explorer.peercoin.net/tx/',
    TPAY: 'https://explorer.tpay.ai/tx/',
    GRS: 'https://groestlsight.groestlcoin.org/tx/',
    PIVX: 'https://pivx.ccore.online/transaction/',
    SUQA: 'http://suqaexplorer.com/tx/',
    XVG: 'https://verge-blockchain.info/tx/',
    OOT: 'http://explorer.utrum.io/tx/',
    ZILLA: 'http://zilla.explorer.dexstats.info/tx/',
    BCH: 'https://bitcoincash.blockexplorer.com/tx/',
    GAME: 'https://blockexplorer.gamecredits.com/transactions/',
    BTC: 'https://blockchain.info/tx/',
    DASH: 'https://live.blockcypher.com/dash/tx/',
    VIA: 'https://explorer.viacoin.org/tx/',
    DOGE: 'https://live.blockcypher.com/doge/tx/',
    ZEC: 'https://explorer.zcha.in/transactions/',
    QTUM: 'https://explorer.qtum.org/tx/',
    DGB: 'https://digiexplorer.info/tx/',
    LTC: 'https://live.blockcypher.com/ltc/tx/',

    //eth
    ETH: 'https://etherscan.io/tx/',
    USDC: 'https://etherscan.io/tx/',
    TUSD: 'https://etherscan.io/tx/',
    OMG: 'https://etherscan.io/tx/',
    MKR: 'https://etherscan.io/tx/',
    ZRX: 'https://etherscan.io/tx/',
    ZIL: 'https://etherscan.io/tx/',
    BAT: 'https://etherscan.io/tx/',
    PAX: 'https://etherscan.io/tx/',
    REP: 'https://etherscan.io/tx/',
    R: 'https://etherscan.io/tx/',
    AE: 'https://etherscan.io/tx/',
    HOT: 'https://etherscan.io/tx/',
    DAI: 'https://etherscan.io/tx/',
    SNT: 'https://etherscan.io/tx/',
    GNT: 'https://etherscan.io/tx/',
    BNT: 'https://etherscan.io/tx/',
    DGD: 'https://etherscan.io/tx/',
    POLY: 'https://etherscan.io/tx/',
    ELF: 'https://etherscan.io/tx/',
    KNC: 'https://etherscan.io/tx/',
    CVC: 'https://etherscan.io/tx/',
    STORJ: 'https://etherscan.io/tx/',
    ICN: 'https://etherscan.io/tx/',
    ANT: 'https://etherscan.io/tx/',
    DLT: 'https://etherscan.io/tx/',
    VIBE: 'https://etherscan.io/tx/',
    XAUR: 'https://etherscan.io/tx/',
    DGX: 'https://etherscan.io/tx/'

};

var explorerListExt = {
  DEX: 'http://dex.explorer.komodo.services',
  SUPERNET: 'http://supernet.explorer.komodo.services'
};

module.exports = {
  isKomodoCoin: isKomodoCoin,
  explorerList: explorerList,
  explorerListExt: explorerListExt,
  kmdAssetChains: _komodoAssetChains,
  kmdCoins: _komodoCoins // all coins that share R-addresses
};
