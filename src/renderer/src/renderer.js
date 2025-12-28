import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { useTextRenderer } from './textrenderer'
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;


const cfg = await window.config.get();

const tr = useTextRenderer(cfg);

//Backend bridge functionality
window.backend.onBridgeEvent(data => {
  tr.renderData(data)
  console.log("[BACKEND MESSAGE]", data);
})
tr.setClickthroughVisuals({ clickIgnored : false });

//All window frame functionality.
window.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-btn");
  const minimizeButton = document.getElementById("minimize-btn");
  const maxUnmaxButton = document.getElementById("max-unmax-btn");
  const closeButton = document.getElementById("close-btn");

  /*menuButton.addEventListener("click", e => {
    // Opens menu at (x,y) coordinates of mouse click on the hamburger icon.
    window.windowControls.openMenu(e.x, e.y);
  });*/

  minimizeButton.addEventListener("click", e => {
    window.windowControls.minimize();
  });

  maxUnmaxButton.addEventListener("click", e => {
    const icon = maxUnmaxButton.querySelector("i.far");

    window.windowControls.toggleMaximize();

    // Change the middle maximize-unmaximize icons.
    if (window.windowControls.isMaximized()) {
      icon.classList.remove("fa-square");
      icon.classList.add("fa-clone");
    } else {
      icon.classList.add("fa-square");
      icon.classList.remove("fa-clone");
    }
  });

  closeButton.addEventListener("click", e => {
    window.windowControls.close();
  });
});

//Clickthrough functionality
window.mainBridge.onClickthroughToggle(e => {
  tr.setClickthroughVisuals(e);
})
