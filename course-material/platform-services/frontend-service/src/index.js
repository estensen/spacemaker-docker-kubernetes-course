import * as services from "./services/services";
import * as local from "./services/local";

import { validate, isValid } from "./services/validation";
import { analyse } from "./services/analysis";
import { run, update as update3D } from "./render";
import { render as renderError } from "./views/errors";
import { render as renderScore } from "./views/score";
import { render as renderLocalServiceModal } from "./views/localservice";
import { state, apply } from "./store";

window.showValidations = false;
const colors = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#ffffff",
  "#000000"
];

function updateHash() {
  const { hash } = document.location;

  const name = hash.replace(/#?\/?/, "");

  if (name) {
    apply({ type: "filter/set", name });
  } else {
    apply({ type: "filter/clear" });
  }
  update();
}

function update() {
  update3D(state.getTiles());
  renderScore(state.getAnalysis());
  renderError(state.getInvalids(), state.getErrors());
  renderLocalServiceModal(state.getLocalServiceMessage(window.localmode));
}

window.addEventListener("hashchange", updateHash, false);

async function callService() {
  if (window.localmode) {
    apply({ type: "local-service/clear" });
  }
  const backend = window.localmode ? local : services;
  let colorIndex = 0;
  for (let { name, service } of await backend.getAllServices()) {
    const color = colors[colorIndex++];
    try {
      const tile = await backend.getServiceResult(service);

      const validation = await validate(tile);
      if (isValid(validation)) {
        apply({ type: "result", name, tile, color });
        const score = await analyse(tile);
        apply({ type: "analyse", name, score, color });
      } else {
        if (window.showValidations) {
          console.log({ name, tile, validation });
        }
        apply({ type: "invalid", name, validation, color });
      }
    } catch (error) {
      if (window.localmode && (error.status === 404 || error.status === 502)) {
        apply({ type: "local-service/not-found" });
      } else {
        apply({ type: "error", name, error, color });
      }
    }
  }

  update();
}

function setLocalMessage(isLocal) {
  if (isLocal) {
    const div = document.getElementById("local-service");
    div.style.visibility = "visible";
  }
}

run(state.getTiles());
callService();
setInterval(callService, 5000);
updateHash();
setLocalMessage(window.localmode);
