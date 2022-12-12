const React = require("react");
const { findDOMNode: fndDOM } = require("react-dom");

class VideoPreview extends React.Component {
  constructor(props) {
    super(props);
    this.drawVideoPreview = this.drawVideoPreview.bind(this);
  }
  drawVideoPreview(event) {
    let video = event.target;
    let contextMid = fndDOM(this.refs.previewMed).getContext("2d"),
      contextSmall = fndDOM(this.refs.previewSmall).getContext("2d");
    setInterval(() => {
      if (video.paused || video.ended) return false;
      contextMid.drawImage(video, 0, 0, 320, 180);
      contextSmall.drawImage(video, 0, 0, 160, 90);
    }, 500);


  }
  render() {
    return (
      <article id="video_fields">
        <video id="originVideo" width="640px" height="360px" onPlay={this.drawVideoPreview} autoPlay loop>
          {this.props.srcess.map((src, key) => <source src={src} type={!key ? "video/mp4" : "video/ogg"} key={key + 1} />)}
          Ваш браузер не поддерживает HTML5-видео
        </video>
        <canvas ref="previewMed" width="320px" height="180px"></canvas>
        <canvas ref="previewSmall" width="160px" height="90px"></canvas>
        <p itemScope>
          <span itemProp="изобретатель">Тим Бернерс-Ли</span> создал
          <span itemProp="изобретение">Всемирную паутину</span>
        </p>

      </article>
    )
  }
}

VideoPreview.defaultProps = {
  srcess: ["/video/sample-10s.mp4"]
}

module.exports = VideoPreview;