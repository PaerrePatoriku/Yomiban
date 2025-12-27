//Page target rendering tools.
function useTextRenderer() {
    console.log(window.$);
    const target = document.getElementById("render-target")
    const renderAreaContainer = $("#render-area-container");
    const activeStateIndicator = $("#active-state-indicator");
    const renderAreaButtons = $("#render-area-buttons");
    console.log(renderAreaContainer.length)
    let latest;
    function renderData(data) {
        latest = data;
        const jsonParsed = JSON.parse(data);
        target.innerHTML = jsonParsed.Text;
    }
    function setClickthroughVisuals(obj) {
        console.log("inside", obj);
        if (obj.clickIgnored) {
            renderAreaContainer.removeClass("render-area-active");
            activeStateIndicator.addClass("d-none");
            renderAreaButtons.addClass("d-none");
        }
        else {
            renderAreaContainer.addClass("render-area-active");
            activeStateIndicator.removeClass("d-none");
            renderAreaButtons.removeClass("d-none");
        }
    }
    return { renderData, setClickthroughVisuals }
}
export { useTextRenderer }