export default function webSocket(url, callback) {
  // WebSocket 实时更新数据
  const ws = new WebSocket(url);
  ws.onopen = () => { console.log('onopen'); };
  ws.onmessage = (event) => {
    callback(event);
  };
  ws.onclose = function (event) { console.log('onclose', event); };
  ws.onerror = function (event) { console.log('onerror', event); };
}
