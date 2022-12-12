const React = require("react");
const AnimationOnImage = require("./animationImage.jsx");
const DraggableElement = require("./draggableElement.jsx");

class LibraryPicture extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = { library: [] }
  }
  componentDidMount() {
    fetch("http://localhost:500/animation_img/library")
      .then(response => response.json())
      .then(data =>
        this.setState({ library: [...data] })
      );
  }
  drag(event) {
    let { type, target, dataTransfer } = event;
    switch (type) {
      case "dragstart":
        dataTransfer.setData("text",
          $(target)
            .css({ border: "3px dotted #000" })
            .attr("class").split(/\ {1,}/).join(" ."));
        dataTransfer.effectAllowed = "move";
        break;
      case "dragend":
        $(target)
          .css({ border: "none" })
        break;
    }
  }
  render() {
    let { library } = this.state || Array.from({ length: 5 }, (_, index) => `/dist/images/library/c(${index + 1}).jpg`);
    return (
      <div id="librarry_picture"
        style={{
          "display": "flex", "justifyContent": "space-between",
          "flexFlow": "column wrap"
        }}
      >
        <DraggableElement />
        {library.map((src, i) =>
          <AnimationOnImage key={i + 1} src={src} width={200} height={200}
            color="#11ff45" radius={40}
            onDragingElement={this.drag.bind(this)}
            className={`draging_animation_image${i + 1}${Math.floor(Math.random() * 10000)}`}
          />
        )}
      </div>
    )
  }
}

module.exports = LibraryPicture;
