//Page target rendering tools.
const target = document.getElementById("render-target")
let latest;
function renderData(data) {
    latest = data;
    const jsonParsed = JSON.parse(data);
    target.innerHTML = jsonParsed.Text;
}
