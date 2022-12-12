self.onmessage = function (ev) {
  let { data, type } = ev.data;
  let avrg;
  if (/^INVERSE_GRAY$/.test(type)) {
    for (let i = 0; i < data.length; i += 4) {
      avrg = Math.floor(data.slice(i, i + 3).reduce((acc, cur) => acc + cur) / 3);
      data[i] = data[i + 1] = data[i + 2] = avrg;
    }
  }
  else if (/^INVERSE$/.test(type)) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i];
      data[i + 2] = 255 - data[i];
    }
  }
  postMessage({ data }, [data.buffer]);
}
