const React = require("react");
const { BsFileEarmarkPlus } = require("react-icons/bs");
const { findDOMNode } = require("react-dom");

class ButtonFileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { style: { opacity: 0, position: "absolute", top: 0, left: 0 } }
  }
  componentDidMount() {
    this.setState({
      style: {
        ... this.state.style,
        width: $(findDOMNode(this.refs["inpt-file-chatbot"])).outerWidth(),
        height: $(findDOMNode(this.refs["inpt-file-chatbot"])).outerHeight()
      }
    })
  }
  render() {
    let { size, accept } = this.props;
    return <div className="btn" ref={"inpt-file-chatbot"} style={{ margin: 0, padding: 0, position: "relative" }}>
      <BsFileEarmarkPlus size={size} />
      <input type="file" accept={accept}
        onChange={(event) => { this.props.loadfile(event.target.files); event.target.value = null; }}
        style={{ ...this.state.style }}
      />
    </div>
  }
}

ButtonFileInput.defaultProps = { size: "2em", accept: ".jpg, .jpeg, .png" }

module.exports = ButtonFileInput;