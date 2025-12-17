const tencentcloud = require("tencentcloud-sdk-nodejs-teo");

const TeoClient = tencentcloud.teo.v20220901.Client;

const clientConfig = {
credential: {
    secretId: "xxx",
    secretKey: "xxx",
},
region: "",
profile: {
    httpProfile: {
    endpoint: "teo.tencentcloudapi.com",
    },
},
};

const client = new TeoClient(clientConfig);
const params = {
    "ZoneId": "zone-xxx",
    "Type": "purge_host",
    "Targets": [
        "www.sumi233.top"
    ]
};
client.CreatePurgeTask(params).then(
(data) => {
    console.log(data);
},
(err) => {
    console.error("error", err);
}
);