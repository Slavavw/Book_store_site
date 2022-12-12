const getTemplate = (template = "hhh.hhh.hhh") => template;
const randomNumber = (range = 250) => Math.floor(Math.random() * range);
const generateColor = () => {
  let arrColor = [], template = getTemplate();
  return (
    function Color() {
      let color = `RGB(${template.split(".").map(() => randomNumber()).join(",")})`;
      while (arrColor.includes(color)) return Color()
      arrColor.push(color);
      return color;
    }
  )
}

module.exports = generateColor;