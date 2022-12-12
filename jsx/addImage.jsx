const React = require("react");
const { BsFileEarmarkPlus } = require("react-icons/bs");
const { findDOMNode } = require("react-dom");

class AdImgeChatBot extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = { "cursor": "pointer" };
    this.loadfile = this.loadfile.bind(this);
    this.img = null;
  }
  loadfile(files) {
    let context = findDOMNode(this.refs['load-image']).getContext("2d");
    Promise.all(Array.of(files).map(el => new Promise((resolve, reject) => {
      let file = el[0];
      let reader = new FileReader();
      if (/image/.test(file.type)) {
        reader.readAsDataURL(file);
        //reader.readAsArrayBuffer(file);        
      }
      if (reader) {
        resolve(reader);
      }
      reader.onerror = (event) => { reject(reader.error.code); }
    })
      .then(reader => {
        reader.onprogress = (event) => {
          /*$("#progressbar_generate").progressbar({
            classes:{"ui-progressbar": "highlight"}
          })*/
          let value = event.lengthComputable ? event.loaded / event.total : 0;
        }
        reader.onload = (event) => {
          this.setState({ "zoomin": "zoom-in" }, () => {
            this.img = new Image(); this.img.src = reader.result;
            this.img.onload = (event) => {
              context.drawImage(this.img, 0, 0, context.canvas.width, context.canvas.height);
              let formdata = new FormData();
              formdata.set("imgeload", reader.result, "ccc");
              let type = /data:(?<data>[^;]+)/.exec(reader.result).groups.data;
              fetch('/load-image',
                {
                  method: "POST",
                  body: formdata,
                  //headers: new Headers({ 'Content-Type': `${type}` })
                }
              )
            }
          })
        }
      }
      )
    ))
  }
  render() {
    let [width, height] = [0, 0];
    if (/zoom-in/gi.test(this.state.zoomin)) { width = height = this.props.size }
    else if (/zoom-out/gi.test(this.state.zoomin)) { width = height = this.props.zooming_size }
    return <div>
      <ButtonFileInput width="200px" height="40px" accept=".jpg, .jpeg, .png" loadfile={this.loadfile} />
      <canvas ref="load-image" width={width} height={height} style={{ "cursor": `${this.state.zoomin}` }}
        onClick={
          () => this.setState(
            { zoomin: /zoom-in/gi.test(this.state.zoomin) ? "zoom-out" : "zoom-in" },
            () => {
              let context = findDOMNode(this.refs['load-image']).getContext("2d");
              context.drawImage(this.img, 0, 0, context.canvas.width, context.canvas.height);
            })
        }
      />
    </div>
  }
}

AdImgeChatBot.defaultProps = {
  size: 300, zooming_size: 600
}

module.exports = AdImgeChatBot;

