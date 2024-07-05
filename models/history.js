const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // 'add' atau 'transfer'
    amount: { type: Number, required: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    fromUserName: { type: String, required: true },
    toUserName: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
