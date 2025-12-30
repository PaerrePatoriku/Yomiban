//Page target rendering tools.

function useTextRenderer(config) {

    const textTarget = $("#render-target")
    const renderAreaContainer = $("#render-area-container");
    const activeStateIndicator = $("#active-state-indicator");
    const renderAreaButtons = $("#render-area-buttons");
    const renderCurrent = $("#render-current-indicator");
    const renderCount = $("#render-count-indicator");
    const renderWrapper = $("#render-wrapper");

    const menuBar = $("#menu-bar");
    let textData = { data: [], currentIndex: 0 };

    function _addData(data) {
        if (textData.data.length >= 5) {
            textData.data.shift();
        }
        textData.data.push(data);
        textData.currentIndex = textData.data.length - 1;
        renderCurrent.html(textData.currentIndex + 1);
        renderCount.html(textData.data.length);
        console.log("CURRENT IDNEX", textData.currentIndex, textData)
    }
    function renderData(data) {

        const jsonParsed = JSON.parse(data);
        _addData(jsonParsed);
        setRenderedData(textData.currentIndex);
    }
    function setRenderedData(idx) {
        renderCurrent.html(idx + 1);
        textTarget.html(textData.data[idx].Text);
    }
    function setClickthroughVisuals(obj) {
        console.log("inside", obj);
        if (obj.clickIgnored) {

            renderAreaContainer.removeClass("render-area-active");
            activeStateIndicator.addClass("d-none");
            renderAreaButtons.addClass("d-none");
            textTarget.addClass("render-area-text-inactive");

            if (config.style.menubar.hideOnClickthrough)
                menuBar.addClass("opacity-0");
        }
        else {
            renderAreaContainer.addClass("render-area-active");
            activeStateIndicator.removeClass("d-none");
            renderAreaButtons.removeClass("d-none");
            textTarget.removeClass("render-area-text-inactive");

            if (config.style.menubar.hideOnClickthrough)
                menuBar.removeClass("opacity-0");
        }
    }

    function init() {
        $("#data-previous-btn").on("click", () => {
            if (textData.currentIndex == 0)
                return;

            textData.currentIndex -= 1;
            setRenderedData(textData.currentIndex);
        })
        $("#data-next-btn").on("click", () => {
            if (textData.currentIndex == textData.data.length - 1)
                return;

            textData.currentIndex += 1;
            setRenderedData(textData.currentIndex);
        })
        renderWrapper.css("align-content", config.style.text.location);
        renderWrapper.css("padding-top", config.style.text.offset);
    }
    init();

    renderData('{ "Text" : "Welcome to yomiban!" }');
    renderData('{ "Text" : "" }');

    return { renderData, setClickthroughVisuals }
}
export { useTextRenderer }