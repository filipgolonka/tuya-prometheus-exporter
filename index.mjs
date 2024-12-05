import { TuyaContext  } from '@tuya/tuya-connector-nodejs';
import express from 'express';
import 'dotenv/config'

const app = express();

const tuya = new TuyaContext({
    baseUrl: 'https://openapi.tuyaeu.com',
    accessKey: process.env.TUYA_ACCESS_KEY,
    secretKey: process.env.TUYA_SECRET_KEY,
});

const getDeviceStatus = async (deviceId) => {
    const response = await tuya.request({
        path: `/v1.0/iot-03/devices/${deviceId}/status`,
        method: 'GET',
    });

    return response;
};

const getVoltage = async () => {
    const response = await getDeviceStatus(process.env.POWER_SOCKET_DEVICE_ID);

    if (!response?.result) {
        return 0.0;
    }

    const voltage = response.result.find(item => item.code === 'cur_voltage');
    if (!voltage?.value) {
        return 0.0;
    }


    return voltage.value / 10;
};

app.get('/metrics', async (req, res) => {
    const voltage = await getVoltage();
    res.send(`Voltage ${voltage}`);
})

const port = 4002;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




