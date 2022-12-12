class DialogModal {
  constructor(title, child, parent, ok = f => f, close = f => f) {
    this.title = title; this.child = child; this.parent = parent;
    this._dialog = null;
    this.close = close || this.closeWnd.bind(this);
  }
  InitDialog() {
    $(this.parent).append(this.child).dialog({
      title: this.title,
      modal: true,
      buttons: [{
        text: "Ok",
        icon: "ui-icon-close",
        click: () => $(this.parent).dialog("close")
      }],
      onclose: this.closeWnd
    });
    return this;
  }
  closeWnd() {
    $(this.parent).children().remove();
  }
  showDialog() { $(this.parent).dialog("open") }
}

module.exports = DialogModal;