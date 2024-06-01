async function fetchAsArrayBuffer(url) {
    const response = await fetch(url);
    return await response.arrayBuffer();
}

function main() {
    const url = "http://demo.castlabs.com/tmp/text0.mp4";
    fetchAsArrayBuffer(url)
        .then(arrayBuffer => {
            console.log('Successfully loaded file ', url);
        })
}

main();
