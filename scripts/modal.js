let documentBody = document.body;
let Modal = undefined;

function createElement(name, classes, parent) {
  let element = document.createElement(name);

  element.className += classes;

  if (parent) {
    parent.appendChild(element);
  }

  return element;
}

function ModalDialog() {
  let main = createElement("div", "modal", documentBody);
  let contents = createElement("div", "modal-contents", main);

  this.modalHeader = createElement("div", "modal-header", contents);
  this.modalBody = createElement("div", "modal-body", contents);
  this.modalFooter = createElement("div", "modal-footer", contents);

  this.confirmButton = createElement("button", "modal-btn modal-confirm", this.modalFooter);
  this.cancelButton = createElement("button", "modal-btn modal-cancel", this.modalFooter);

  this.show = function (options) {
    let instance = this;

    instance.modalHeader.innerHTML = options.title;
    instance.modalBody.innerHTML = options.contents;

    instance.confirmButton.innerHTML = options.confirmButtonText || "Okay";
    instance.cancelButton.innerHTML = options.cancelButtonText || "Close";

    documentBody.classList.add("modal-visible");

    return new Promise((resolve) => {
      const getCallbackByType = (type) => {
        return function () {
          instance.hide();
          resolve(type === "confirm");
        };
      };

      instance.confirmCallback = getCallbackByType("confirm");
      instance.confirmButton.addEventListener("click", instance.confirmCallback);

      instance.cancelCallback = getCallbackByType("cancel");
      instance.cancelButton.addEventListener("click", instance.cancelCallback);
    });
  };

  this.hide = function () {
    documentBody.classList.remove("modal-visible");

    if (this.confirmCallback !== undefined) {
      this.confirmButton.removeEventListener("click", this.confirmCallback);
      this.confirmCallback = undefined;
    }

    if (this.cancelCallback !== undefined) {
      this.cancelButton.removeEventListener("click", this.cancelCallback);
      this.cancelCallback = undefined;
    }
  };
}

window.addEventListener("DOMContentLoaded", () => {
  Modal = new ModalDialog();
});