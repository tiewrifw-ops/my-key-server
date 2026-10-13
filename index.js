const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const validKeys = {};

// API แจกคีย์
app.get('/getkey', (req, res) => {
    const userHwid = req.query.hwid || "unknown";
    const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newKey = "VIPER-" + randomString;
    const expireTime = Date.now() + (24 * 60 * 60 * 1000); // 24 ชั่วโมง

validKeys[newKey] = {
    hwid: userHwid,
    expiresAt: expireTime
};

    res.json({
        status: "success",
        key: newKey,
        expires_in: "24 Hours"
    });
});

// API ตรวจสอบคีย์
app.post('/verify', (req, res) => {
    const { key, hwid } = req.body;

    if (!key || !validKeys[key]) {
        return res.json({ success: false, message: "คีย์ไม่ถูกต้อง!" });
    }

    const keyData = validKeys[key];

    if (Date.now() > keyData.expiresAt) {
        delete validKeys[key];
        return res.json({ success: false, message: "คีย์หมดอายุแล้ว!" });
    }

    if (keyData.hwid !== "unknown" && keyData.hwid !== hwid) {
        return res.json({ success: false, message: "คีย์นี้ถูกใช้กับเครื่องอื่นไปแล้ว!" });
    }

    return res.json({ success: true, message: "อนุมัติการใช้งาน!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
        
