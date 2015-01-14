module.exports = {
    type: "object",
    properties: {
        key: {
            type: "string",
            maxLength: 8,
            minLength: 8
        },
        server_url: {
            type: "string",
            format: "uri"
        },
        mode: {
            type: "string",
            enum: ["training", "arena"]
        },
        turns: {
            type: "number"
        },
        bot_path: {
            type: "string"
        }
    },
    required: ["key", "server_url", "mode", "bot_path"]
};

