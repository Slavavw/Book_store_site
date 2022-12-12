const React = require("react");
const { HiOutlineTrash } = require("react-icons/hi");

function DraggableElement() {
  if (!("draggable" in $("<span>"))) return null;
  const handleDrag = (function () {
    let style = {
      dragstart: { border: "3px dotted #000" },
      dragenter: { border: "3px solid red" },
      dragleave: { border: "none" }
    }
    return function (event) {
      let { type, target, dataTransfer } = event;
      switch (type) {
        case "dragstart":
          $(target).css({ ...style[`${type}`] });
          dataTransfer.effectAllowed = "move";
          dataTransfer.setData("Text", target.getAttribute("class"));
          break;
        case "dragenter":
          $(target).css({ ...style[`${type}`] });
          break;
        case "dragleave":
          $(target).css({ ...style[`${type}`] });
          break;
        case "dragover":
          event.preventDefault();
          return false;
        case "drop":
          event.preventDefault();
          let class_name = dataTransfer.getData("Text");
          $(`.${class_name}`).remove().appendTo(target);
          break;
      }
    }
  })();
  return <div>
    <div className="catcher"
      style={{ "width": "40px", "height": "40px", "margin": "5px" }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrag}
    ><HiOutlineTrash size={"40px"} color={"white"} /></div>
    <div style={{ "width": 100, "height": 100, "background": "rgb(130,50,8)" }} draggable
      onDragStart={handleDrag} className={"className"} onDragEnd={handleDrag} />
  </div>
}

module.exports = DraggableElement;
/*
<div
      className="footbar"
      style={{ "backgroundColor": "yellow", "width": "100px", "height": "100px", "cursor": "pointer" }}
      draggable
      onDragStart={handleDrag}
    ></div>
    */