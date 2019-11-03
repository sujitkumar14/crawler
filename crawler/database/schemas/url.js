
module.exports = {
    url: { type: String, unique: true, index: true },
    referenceCount: { type: Number, default: 1 },
    params: [String],
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: Date.now }
};