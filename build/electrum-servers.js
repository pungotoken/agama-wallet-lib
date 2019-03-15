const fees = require('./fees');

// TODO: add a script to sync electrum severs list from https://github.com/jl777/coins/tree/master/electrums

let _electrumServers = {
    // currently supported coins
    pgt: [
        'electrum1.pungo.cloud:10002:tcp', 
        'electrum2.pungo.cloud:10002:tcp',
    ],
    smart: [
        'electrum1.pungo.cloud:10003:tcp', 
        'electrum2.pungo.cloud:10003:tcp',        
        'electrum1.smartcash.cc:50001:tcp',
        'electrum2.smartcash.cc:50001:tcp',
        'electrum3.smartcash.cc:50001:tcp',
        'electrum4.smartcash.cc:50001:tcp',
    ],
    vrsc: [
        'electrum1.pungo.cloud:10014:tcp',
        'electrum2.pungo.cloud:10014:tcp',
        'el0.vrsc.0x03.services:10000:tcp',
        'el1.vrsc.0x03.services:10000:tcp',
    ],
    eqli: [
        'electrum1.pungo.cloud:10015:tcp',
        'electrum2.pungo.cloud:10015:tcp'
    ],
    ppc: [
        'electrum1.pungo.cloud:10019:tcp',
        'electrum2.pungo.cloud:10019:tcp'
    ],
    tpay: [
        'electrum1.pungo.cloud:10022:tcp',
        'electrum2.pungo.cloud:10022:tcp'
    ],
    oot: [
        'electrum1.pungo.cloud:10013:tcp',
        'electrum2.pungo.cloud:10013:tcp',
        'electrum1.utrum.io:10088:tcp',
        'electrum2.utrum.io:10088:tcp',
    ],
    zilla: [
        'electrum1.pungo.cloud:10012:tcp',
        'electrum2.pungo.cloud:10012:tcp',
        'electrum1.cipig.net:10028:tcp',
        'electrum2.cipig.net:10028:tcp',
    ],
    bch: [
        'electrum1.pungo.cloud:10006:tcp',
        'electrum2.pungo.cloud:10006:tcp',
        'bch.imaginary.cash:50001:tcp',
        'electroncash.dk:50001:tcp',
        'wallet.satoshiscoffeehouse.com:50001:tcp',
    ],
    game: [
        'electrum1.pungo.cloud:10011:tcp',
        'electrum2.pungo.cloud:10011:tcp',
        'electrum1.cipig.net:10072:tcp',
        'electrum2.cipig.net:10072:tcp',
    ],
    xvg: [
        'e1.verge-electrum.com:50001:tcp',
        'e2.verge-electrum.com:50001:tcp',
        '46.163.118.201:50002:ssl',
    ],
    btc: [
        'electrum1.pungo.cloud:10000:tcp', 
        'electrum2.pungo.cloud:10000:tcp',
        'electrum1.cipig.net:10000:tcp',
        'electrum2.cipig.net:10000:tcp',
        'electrum3.cipig.net:10000:tcp',
    ],
    dash: [
        'electrum1.pungo.cloud:10004:tcp',
        'electrum2.pungo.cloud:10004:tcp',
        'electrum1.cipig.net:10061:tcp',
        'electrum2.cipig.net:10061:tcp',
    ],
    via: [
        'electrum1.pungo.cloud:10009:tcp',
        'electrum2.pungo.cloud:10009:tcp',
        'viax1.bitops.me:50001:tcp',
        'viax2.bitops.me:50001:tcp',
        'viax3.bitops.me:50001:tcp',
    ],
    doge: [
        'electrum1.pungo.cloud:10007:tcp',
        'electrum2.pungo.cloud:10007:tcp',
        'electrum1.cipig.net:10060:tcp',
        'electrum2.cipig.net:10060:tcp',
    ],
    zec: [
        'electrum1.pungo.cloud:10005:tcp',
        'electrum2.pungo.cloud:10005:tcp',
        'electrum1.cipig.net:10058:tcp',
        'electrum2.cipig.net:10058:tcp',
    ],
    grs: [
        'electrum1.pungo.cloud:10021:tcp',
        'electrum2.pungo.cloud:10021:tcp',
        'electrum10.groestlcoin.org:50001:tcp',
        'electrum11.groestlcoin.org:50001:tcp',
    ],
    qtum: [
        'electrum1.pungo.cloud:10024:tcp',
        'electrum2.pungo.cloud:10024:tcp',
        's1.qtum.info:50001:tcp',
        's2.qtum.info:50001:tcp',
    ],
    kmd: [
        'electrum1.pungo.cloud:10001:tcp',
        'electrum2.pungo.cloud:10001:tcp',
        'electrum1.cipig.net:10001:tcp',
        'electrum2.cipig.net:10001:tcp',
    ],
    suqa: [
        'electrum1.suqa.org:12159:tcp',
        'electrum2.suqa.org:12159:tcp',
        'electrum1.pungo.cloud:10017:tcp',
        'electrum2.pungo.cloud:10017:tcp',
    ],
    pivx: [
        'electrum1.pungo.cloud:10020:tcp',
        'electrum2.pungo.cloud:10020:tcp'
    ],
    dgb: [
        'electrum1.pungo.cloud:10010:tcp',
        'electrum2.pungo.cloud:10010:tcp',
        'electrum1.cipig.net:10059:tcp',
        'electrum2.cipig.net:10059:tcp',
    ],
    ltc: [
        'electrum1.pungo.cloud:10023:tcp',
        'electrum2.pungo.cloud:10023:tcp',
        'electrum-ltc.bysh.me:50001:tcp',
        'electrum-ltc.ddns.net:50001:tcp',
        'electrum-ltc.wilv.in:50001:tcp',
        'electrum.ltc.xurious.com:50001:tcp',
    ],


};

let electrumServers = {};

for (let key in _electrumServers) {
    electrumServers[key] = {
        txfee: fees[key] ? fees[key] : 0,
        serverList: _electrumServers[key],
    };
}

module.exports = electrumServers;
