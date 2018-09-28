


function listener(ev){
	if(ev.parentFrameId !== -1)return;
	let name= new URL(ev.url).hostname;
    var icon = new Identicon(name+name+name+name+name+name, {
        format: 'svg', size:64
    }  )
    console.log(name)
    var img = new Image();
    img.src = "data:image/svg+xml;base64," + icon.toString();

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;
    context.drawImage(img, 0, 0 );
    var myData = context.getImageData(0, 0, 64, 64);

    browser.browserAction.setIcon(
        {
            imageData : {
               64:myData
            }
        }       // object
    )
}

browser.webNavigation.onCommitted.addListener(
  listener, {

        url: [{schemes: ["http", "https"]}]}

);
