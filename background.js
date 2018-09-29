
function sha256(str) {
    // We transform the string into an arraybuffer.
    var buffer = new TextEncoder("utf-8").encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
        return hex(hash);
    });
}

function hex(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
        // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
        var value = view.getUint32(i)
        // toString(16) will give the hex representation of the number without padding
        var stringValue = value.toString(16)
        // We use concatenation and slice for padding
        var padding = '00000000'
        var paddedValue = (padding + stringValue).slice(-padding.length)
        hexCodes.push(paddedValue);
    }

    // Join all the hex strings into one
    return hexCodes.join("");
}


function createIdenticon(id) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
        let name = new URL(tabs[0].url).hostname;
        console.log(name)

        sha256(name).then(function (name) {

            var icon = new Identicon(name, {
                format: 'svg', size: 64, margin: 0
            })

            var img = new Image();
            img.src = "data:image/svg+xml;base64," + icon.toString();

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 64;
            context.drawImage(img, 0, 0);
            var myData = context.getImageData(0, 0, 64, 64);

            browser.pageAction.setIcon(
                {
                    tabId: id,
                    imageData: {
                        64: myData
                    }
                }       // object
            )
            console.log("Showing Identicon")
            browser.pageAction.show(id)
        });
    });

}

function listener(ev){
    console.log(ev)
	if(ev.frameId !== 0)return;
	if(ev.transitionType == "auto_subframe")return;
    createIdenticon(ev);

}

browser.tabs.onUpdated.addListener(createIdenticon)
/*browser.webNavigation.onCommitted.addListener(
  listener, {

        url: [{schemes: ["http", "https"]}]}

);*/
