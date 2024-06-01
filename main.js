async function fetchAsArrayBuffer(url) {
    const response = await fetch(url);
    return await response.arrayBuffer();
}

function parseBoxes(buffer) {
    const dataView = new DataView(buffer);
    let offset = 0;

    while (offset < dataView.byteLength) {
        // first four bytes (bytes 03) specify the size
        const size = dataView.getUint32(offset);
        // Bytes 4-7 specify the type of the box
        const type = String.fromCharCode(
            dataView.getUint8(offset + 4),
            dataView.getUint8(offset + 5),
            dataView.getUint8(offset + 6),
            dataView.getUint8(offset + 7)
        );

        if (type === 'mdat') {
            const content = new TextDecoder("utf-8").decode(new Uint8Array(buffer, offset + 8, size - 8));
            console.log(`Content of mdat box is: ${content}`);
            extractBase64Images(content);
        }

        offset += size;
    }
}

function extractBase64Images(content) {
    // parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    const images = xmlDoc.getElementsByTagName("smpte:image");

    for (let i = 0; i < images.length; i++) {
        const base64Data = images[i].textContent;
        const img = document.createElement("img");
        img.src = `data:image/jpeg;base64,${base64Data}`;
        document.body.appendChild(img);
    }
}

function main() {
    const url = "http://demo.castlabs.com/tmp/text0.mp4";
    fetchAsArrayBuffer(url)
        .then(arrayBuffer => {
            console.log('Successfully loaded file ', url);
            parseBoxes(arrayBuffer)
        })
}

main();
