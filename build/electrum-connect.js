'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
MIT License

Copyright (c) 2017 Yuki Akiyama, SuperNET
Copyright (c) 2017 - 2018 SuperNET

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

NodeJS TCP/SSL lib to facilitate connection to Electrum servers

*/

var tls = require('tls');
var net = require('net');
var EventEmitter = require('events').EventEmitter;

var SOCKET_MAX_TIMEOUT = 10000;

var makeRequest = function makeRequest(method, params, id) {
  return JSON.stringify({
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: id
  });
};

var createRecursiveParser = function createRecursiveParser(maxDepth, delimiter) {
  var MAX_DEPTH = maxDepth;
  var DELIMITER = delimiter;
  var recursiveParser = function recursiveParser(n, buffer, callback) {
    if (buffer.length === 0) {
      return {
        code: 0,
        buffer: buffer
      };
    }

    if (n > MAX_DEPTH) {
      return {
        code: 1,
        buffer: buffer
      };
    }

    var xs = buffer.split(DELIMITER);

    if (xs.length === 1) {
      return {
        code: 0,
        buffer: buffer
      };
    }

    callback(xs.shift(), n);

    return recursiveParser(n + 1, xs.join(DELIMITER), callback);
  };

  return recursiveParser;
};

var createPromiseResult = function createPromiseResult(resolve, reject) {
  return function (err, result) {
    if (err) {
      // console.log('electrum error:');
      // console.log(err);
      resolve(err);
      // reject(err);
    } else {
      resolve(result);
    }
  };
};

var MessageParser = function () {
  function MessageParser(callback) {
    _classCallCheck(this, MessageParser);

    this.buffer = '';
    this.callback = callback;
    this.recursiveParser = createRecursiveParser(20, '\n');
  }

  _createClass(MessageParser, [{
    key: 'run',
    value: function run(chunk) {
      this.buffer += chunk;

      while (true) {
        var res = this.recursiveParser(0, this.buffer, this.callback);

        this.buffer = res.buffer;

        if (res.code === 0) {
          break;
        }
      }
    }
  }]);

  return MessageParser;
}();

var util = {
  makeRequest: makeRequest,
  createRecursiveParser: createRecursiveParser,
  createPromiseResult: createPromiseResult,
  MessageParser: MessageParser
};

var getSocket = function getSocket(protocol, options) {
  switch (protocol) {
    case 'tcp':
      return new net.Socket();
    case 'tls':
    // todo
    case 'ssl':
      return new tls.TLSSocket(options);
  }

  throw new Error('unknown protocol');
};

var initSocket = function initSocket(self, protocol, options) {
  var conn = getSocket(protocol, options);

  conn.setTimeout(SOCKET_MAX_TIMEOUT);
  conn.on('timeout', function () {
    console.log('socket timeout');
    self.onError(new Error('socket timeout'));
    self.onClose();
  });
  conn.setEncoding('utf8');
  conn.setKeepAlive(true, 0);
  conn.setNoDelay(true);
  conn.on('connect', function () {
    self.onConnect();
  });
  conn.on('close', function (e) {
    self.onClose(e);
  });
  conn.on('data', function (chunk) {
    self.onReceive(chunk);
  });
  conn.on('end', function (e) {
    self.onEnd(e);
  });
  conn.on('error', function (e) {
    self.onError(e);
  });

  return conn;
};

var Client = function () {
  function Client(port, host) {
    var _this = this;

    var protocol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'tcp';
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : void 0;

    _classCallCheck(this, Client);

    this.id = 0;
    this.port = port;
    this.host = host;
    this.protocolVersion = null;
    this.callbackMessageQueue = {};
    this.subscribe = new EventEmitter();
    this.conn = initSocket(this, protocol, options);
    this.mp = new util.MessageParser(function (body, n) {
      _this.onMessage(body, n);
    });
    this.status = 0;
  }

  _createClass(Client, [{
    key: 'setProtocolVersion',
    value: function setProtocolVersion(version) {
      this.protocolVersion = version;
    }
  }, {
    key: 'connect',
    value: function connect() {
      var _this2 = this;

      if (this.status) {
        return Promise.resolve();
      }

      this.status = 1;

      return new Promise(function (resolve, reject) {
        var errorHandler = function errorHandler(e) {
          return reject(e);
        };

        _this2.conn.connect(_this2.port, _this2.host, function () {
          _this2.conn.removeListener('error', errorHandler);
          resolve();
        });
        _this2.conn.on('error', errorHandler);
      });
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.status) {
        return;
      }

      this.conn.end();
      this.conn.destroy();
      this.status = 0;
    }
  }, {
    key: 'request',
    value: function request(method, params) {
      var _this3 = this;

      if (!this.status) {
        return Promise.reject(new Error('ESOCKET'));
      }

      return new Promise(function (resolve, reject) {
        var id = ++_this3.id;
        var content = util.makeRequest(method, params, id);

        _this3.callbackMessageQueue[id] = util.createPromiseResult(resolve, reject);
        _this3.conn.write(content + '\n');
      });
    }
  }, {
    key: 'response',
    value: function response(msg) {
      var callback = this.callbackMessageQueue[msg.id];

      if (callback) {
        delete this.callbackMessageQueue[msg.id];

        if (msg.error) {
          callback(msg.error);
        } else {
          callback(null, msg.result);
        }
      } else {
        // can't get callback
      }
    }
  }, {
    key: 'onMessage',
    value: function onMessage(body, n) {
      var msg = JSON.parse(body);

      if (msg instanceof Array) {
        // don't support batch request
      } else if (msg.id !== void 0) {
        this.response(msg);
      } else {
        this.subscribe.emit(msg.method, msg.params);
      }
    }
  }, {
    key: 'onConnect',
    value: function onConnect() {}
  }, {
    key: 'onClose',
    value: function onClose() {
      var _this4 = this;

      Object.keys(this.callbackMessageQueue).forEach(function (key) {
        _this4.callbackMessageQueue[key](new Error('close connect'));
        delete _this4.callbackMessageQueue[key];
      });
    }
  }, {
    key: 'onReceive',
    value: function onReceive(chunk) {
      this.mp.run(chunk);
    }
  }, {
    key: 'onEnd',
    value: function onEnd() {}
  }, {
    key: 'onError',
    value: function onError(e) {}
  }]);

  return Client;
}();

var ElectrumConnect = function (_Client) {
  _inherits(ElectrumConnect, _Client);

  function ElectrumConnect(protocol, port, host, options) {
    _classCallCheck(this, ElectrumConnect);

    return _possibleConstructorReturn(this, (ElectrumConnect.__proto__ || Object.getPrototypeOf(ElectrumConnect)).call(this, protocol, port, host, options));
  }

  _createClass(ElectrumConnect, [{
    key: 'onClose',
    value: function onClose() {
      var _this6 = this;

      _get(ElectrumConnect.prototype.__proto__ || Object.getPrototypeOf(ElectrumConnect.prototype), 'onClose', this).call(this);
      var list = ['server.peers.subscribe', 'blockchain.numblocks.subscribe', 'blockchain.headers.subscribe', 'blockchain.address.subscribe'];

      list.forEach(function (event) {
        return _this6.subscribe.removeAllListeners(event);
      });
    }

    // ref: http://docs.electrum.org/en/latest/protocol.html

  }, {
    key: 'serverVersion',
    value: function serverVersion(client_name, protocol_version) {
      return this.request('server.version', [client_name, protocol_version]);
    }
  }, {
    key: 'serverBanner',
    value: function serverBanner() {
      return this.request('server.banner', []);
    }
  }, {
    key: 'serverDonationAddress',
    value: function serverDonationAddress() {
      return this.request('server.donation_address', []);
    }
  }, {
    key: 'serverPeersSubscribe',
    value: function serverPeersSubscribe() {
      return this.request('server.peers.subscribe', []);
    }
  }, {
    key: 'blockchainAddressGetBalance',
    value: function blockchainAddressGetBalance(str) {
      return this.request(this.protocolVersion && this.protocolVersion === '1.4' ? 'blockchain.scripthash.get_balance' : 'blockchain.address.get_balance', [str]);
    }
  }, {
    key: 'blockchainAddressGetHistory',
    value: function blockchainAddressGetHistory(str) {
      return this.request(this.protocolVersion && this.protocolVersion === '1.4' ? 'blockchain.scripthash.get_history' : 'blockchain.address.get_history', [str]);
    }
  }, {
    key: 'blockchainAddressGetMempool',
    value: function blockchainAddressGetMempool(address) {
      return this.request('blockchain.address.get_mempool', [address]);
    }
  }, {
    key: 'blockchainAddressListunspent',
    value: function blockchainAddressListunspent(str) {
      return this.request(this.protocolVersion && this.protocolVersion === '1.4' ? 'blockchain.scripthash.listunspent' : 'blockchain.address.listunspent', [str]);
    }
  }, {
    key: 'blockchainBlockGetHeader',
    value: function blockchainBlockGetHeader(height) {
      return this.request(this.protocolVersion && this.protocolVersion === '1.4' ? 'blockchain.block.header' : 'blockchain.block.get_header', [height]);
    }
  }, {
    key: 'blockchainBlockGetChunk',
    value: function blockchainBlockGetChunk(index) {
      return this.request('blockchain.block.get_chunk', [index]);
    }
  }, {
    key: 'blockchainEstimatefee',
    value: function blockchainEstimatefee(number) {
      return this.request('blockchain.estimatefee', [number]);
    }
  }, {
    key: 'blockchainHeadersSubscribe',
    value: function blockchainHeadersSubscribe() {
      return this.request('blockchain.headers.subscribe', []);
    }
  }, {
    key: 'blockchainNumblocksSubscribe',
    value: function blockchainNumblocksSubscribe() {
      return this.request('blockchain.numblocks.subscribe', []);
    }
  }, {
    key: 'blockchainRelayfee',
    value: function blockchainRelayfee() {
      return this.request('blockchain.relayfee', []);
    }
  }, {
    key: 'blockchainTransactionBroadcast',
    value: function blockchainTransactionBroadcast(rawtx) {
      return this.request('blockchain.transaction.broadcast', [rawtx]);
    }
  }, {
    key: 'blockchainTransactionGet',
    value: function blockchainTransactionGet(tx_hash, height) {
      return this.request('blockchain.transaction.get', height ? [tx_hash, height] : [tx_hash]);
    }
  }, {
    key: 'blockchainTransactionGetMerkle',
    value: function blockchainTransactionGetMerkle(tx_hash, height) {
      return this.request('blockchain.transaction.get_merkle', [tx_hash, height]);
    }
  }]);

  return ElectrumConnect;
}(Client);

module.exports = ElectrumConnect;