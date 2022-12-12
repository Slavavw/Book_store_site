const React = require("react");
const { HiDocumentAdd } = require("react-icons/hi");
const mime = require("mime");

module.exports = function FileLoader({ setImage = f => f }) {
  function read_image_file(file) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function (e) {
      let img = $("<img/>").attr("src", e.target.result).attr("title", "new image");
      setImage(img);
      let data_url = new URL(location.pathname); data_url.searchParams.set("file", e.target.result);
      fetch(data_url.href, {
        method: "POST",
        headers: new Headers({ "Content-Type": mime.getType(file) }),
        body: file
      });
    }
  }
  return <input type={"file"} onChange={function (e) {
    let file = e.target.files;
    if (file[0].type.match(/image/)) {
      this.read_image_file(file[0]);
    }
  }}
  ><HiDocumentAdd /></input>
}
