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

        console.log("Setting up event listeners for VOICE_STATE_UPDATE and VOICE_SERVER_UPDATE.");
        
        this.client.on("VOICE_STATE_UPDATE", (data) => {
            console.log("Received VOICE_STATE_UPDATE event.");
            this.handleVoiceStateUpdate(data);
        });
        this.client.on("VOICE_SERVER_UPDATE", (data) => {
            console.log("Received VOICE_SERVER_UPDATE event.");
            this.handleVoiceServerUpdate(data);
        });
    }

    async joinVoiceChannel(guildId, channelId) {
        console.log("Trying to join voice channel", channelId, "in guild", guildId);
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
        console.log("Handling VOICE_STATE_UPDATE event:", data);
        this.sessionId = data.session_id;
    }

    handleVoiceServerUpdate(data) {
        console.log("Handling VOICE_SERVER_UPDATE event:", data);
        const token = data.token;
        const endpoint = data.endpoint.split(":")[0]; // Removing port
        this.connectToVoiceWebSocket(endpoint, token, data.guild_id);
    }

    connectToVoiceWebSocket(endpoint, token, guildId) {
        console.log(`Connecting to Voice WebSocket using endpoint: ${endpoint}`);
        
        this.voiceWebSocket = new WebSocket(`wss://${endpoint}?v=4`);
        this.voiceWebSocket.on("open", () => {
            console.log("Connected to Voice WebSocket.");
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
            console.log("Received message from Voice WebSocket:", data);
            const message = JSON.parse(data);
            if (message.op === 2) this.handleVoiceReady(message.d);
            if (message.op === 4) this.handleVoiceSessionDescription(message.d);
        });
    }

    handleVoiceReady(data) {
        console.log("Handling Voice Ready data:", data);
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
        console.log(`Selecting protocol with IP: ${ip} and Port: ${port}`);
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
        console.log("Voice Session Description Data:", data);
        this.ssrc = data.ssrc;
        this.ip = data.ip;
        this.port = data.port;
        this.modes = data.modes;
        this.secretKey = Buffer.from(data.secret_key);
    }

    playAudioFile(filePath) {
        this.sequence = 0;
        this.timestamp = 0;

        if (!this.secretKey) {
            console.error("Secret key not set. Cannot play audio.");
            return;
        }

        console.log(`Playing audio file: ${filePath}`);

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
            console.log("FFmpeg processing completed.");
            const audioData = Buffer.concat(chunks);
            for (let i = 0; i < audioData.length; i += 1920) {
                const segment = audioData.slice(i, i + 1920);
                const opusEncodedData = this.encoder.encode(segment);
                const rtpHeader = Buffer.alloc(12);
                rtpHeader.writeUInt16BE(0x80 << 8 | 0x78, 0);
                rtpHeader.writeUInt16BE(this.sequence, 2);
                rtpHeader.writeUInt32BE(this.timestamp, 4);
                rtpHeader.writeUInt32BE(this.ssrc, 8);
                const nonce = Buffer.alloc(24);
                rtpHeader.copy(nonce, 0, 8, 12);
                const encryptedPacket = sodium.crypto_secretbox_easy(
                    Buffer.concat([rtpHeader.slice(0, 8), opusEncodedData]),
                    nonce,
                    this.secretKey,
                );
                this.udpSocket.send(encryptedPacket, this.port, this.ip);
                this.sequence += 1;
                this.timestamp += 960;
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
