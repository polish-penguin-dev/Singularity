const WebSocket = require("ws");
const { OpusEncoder } = require("@discordjs/opus");
const dgram = require("dgram");
const spawn = require("child_process").spawn;
const sodium = require("libsodium-wrappers");

class VoiceNamespace {
    constructor(client) {
        this.client = client;
        this.voiceWebSocket = null;
        this.encoder = new OpusEncoder(48000, 2);
        this.udpSocket = dgram.createSocket("udp4");

        this.client.on("VOICE_STATE_UPDATE", (data) =>
            this.handleVoiceStateUpdate(data),
        );
        this.client.on("VOICE_SERVER_UPDATE", (data) =>
            this.handleVoiceServerUpdate(data),
        );
    }

    async joinVoiceChannel(guildId, channelId) {
        const payload = {
            op: 4,
            d: {
                guild_id: guildId,
                channel_id: channelId,
                self_mute: false,
                self_deaf: false,
            },
        };
        this.client.ws.send(JSON.stringify(payload));
    }

    handleVoiceStateUpdate(data) {
        this.sessionId = data.session_id;
    }

    handleVoiceServerUpdate(data) {
        const token = data.token;
        const endpoint = data.endpoint.split(":")[0]; // Removing port
        this.connectToVoiceWebSocket(endpoint, token, data.guild_id);
    }

    connectToVoiceWebSocket(endpoint, token, guildId) {
        this.voiceWebSocket = new WebSocket(`wss://${endpoint}?v=4`);
        this.voiceWebSocket.on("open", () => {
            const payload = {
                op: 0,
                d: {
                    server_id: guildId,
                    user_id: this.client.user.id,
                    session_id: this.sessionId,
                    token: token,
                },
            };
            this.voiceWebSocket.send(JSON.stringify(payload));
        });

        this.voiceWebSocket.on("message", (data) => {
            const message = JSON.parse(data);
            if (message.op === 2) this.handleVoiceReady(message.d);
            if (message.op === 4) this.handleVoiceSessionDescription(message.d);
        });
    }

    handleVoiceReady(data) {
        const { ip, port } = data;
        this.udpSocket.bind(); // Bind to all IPs and a random port

        this.udpSocket.once("message", (msg) => {
            const packet = Buffer.from(msg);
            const rIP = packet.toString("utf-8", 4, packet.indexOf(0, 4));
            const rPort = packet.readUInt16BE(packet.length - 2);

            this.selectProtocol(rIP, rPort);
        });

        const emptyPacket = Buffer.alloc(70);
        emptyPacket.writeUInt16BE(1, 0);
        emptyPacket.writeUInt16BE(70, 2);
        this.udpSocket.send(emptyPacket, port, ip);
    }

    selectProtocol(ip, port) {
        const payload = {
            op: 1,
            d: {
                protocol: "udp",
                data: {
                    address: ip,
                    port: port,
                    mode: "xsalsa20_poly1305",
                },
            },
        };
        this.voiceWebSocket.send(JSON.stringify(payload));
    }

    handleVoiceSessionDescription(data) {
        this.secretKey = data.secret_key;
        this.playAudioFile("./Music.mp3");
    }

    playAudioFile(filePath) {
        const ffmpeg = spawn("ffmpeg", [
            "-i",
            filePath,
            "-f",
            "s16le",
            "-ar",
            "48000",
            "-ac",
            "2",
            "pipe:1",
        ]);

        const chunks = [];
        ffmpeg.stdout.on("data", (chunk) => {
            chunks.push(chunk);
        });

        ffmpeg.stdout.on("end", () => {
            const audioData = Buffer.concat(chunks);
            for (let i = 0; i < audioData.length; i += 1920) {
                const segment = audioData.slice(i, i + 1920);
                const opusEncodedData = this.encoder.encode(segment);
                const nonce = Buffer.alloc(24);
                const encryptedPacket = sodium.crypto_secretbox_easy(
                    opusEncodedData,
                    nonce,
                    this.secretKey,
                );
                this.udpSocket.send(encryptedPacket);
            }
        });

        ffmpeg.stderr.on("data", (data) => {
            console.error(`FFmpeg stderr: ${data}`);
        });

        ffmpeg.on("close", (code) => {
            console.log(`FFmpeg child process closed with code ${code}`);
        });
    }
}

module.exports = VoiceNamespace;
