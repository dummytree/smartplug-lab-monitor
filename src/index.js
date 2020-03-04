const { Client } = require("tplink-smarthome-api");
const fs = require("fs");

let interval = 5000;
let outputFormat = "console";
let outputName = "results/rasp-pi-camera-normal";
let ipAddr = "";

const processOutput = data => {
    switch (outputFormat.toLowerCase()) {
        case "json":
            fs.readFile(outputName + ".json", (err, file) => {
                const results = err ? [] : JSON.parse(file);
                results.push(data);
                fs.writeFileSync(
                    outputName + ".json",
                    JSON.stringify(results, null, 4)
                );
            });
            break;
        default:
            console.log(data);
            break;
    }
};

const getRealTime = async interval => {
    const client = new Client();
    if (ipAddr.length > 0) {
        device = await client.getDevice({ host: ipAddr });
        device.setPowerState(false);
        const { emeter } = device;

        setInterval(() => {
            emeter.getRealtime().then(data => {
                data.time = Date();
                processOutput(data);
            });
        }, interval);
    } else throw new Error("INVALID IP ADDR");
};

module.exports = (async () => {
    const cliOptions = process.argv.slice(2);

    console.log({ cliOptions });

    for (const option of cliOptions) {
        if (option.match("--interval=")) {
            interval = option.match("interval").input.split("=")[1];
        }

        if (option.match("--outputFormat=")) {
            outputFormat = option.match("--outputFormat=").input.split("=")[1];
        }

        if (option.match("--outputName")) {
            outputName = option.match("--outputName=").input.split("=")[1];
        }

        if (option.match("--ip")) {
            ipAddr = option.match("--ip=").input.split("=")[1];
        }
    }

    console.log({ interval, outputFormat, outputName });
    getRealTime(interval);
})();
