export default function getParams(key) {
  // eslint-disable-next-line
  const url = location.search.replace(/^\?/, '').split('&');
  const paramsObj = {};
  for (let i = 0, iLen = url.length; i < iLen; i++) {
    const param = url[i].split('=');
    paramsObj[param[0]] = param[1];
  }
  if (key) {
    return paramsObj[key] || '';
  }
  return paramsObj;
}