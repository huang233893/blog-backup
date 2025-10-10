
const tencentcloud = require("tencentcloud-sdk-nodejs-teo");

const TeoClient = tencentcloud.teo.v20220901.Client;

const clientConfig = {
credential: {
    secretId: "IKIDkpmgPvDLFGAqKbicKvIUSFpBMLuGORRJ",
    secretKey: "jGahborhKjxAB0c1FF2kFZgfQ0ObCetw",
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
    "ZoneId": "zone-3exqr1us7xlg",
    "Type": "purge_all",
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
