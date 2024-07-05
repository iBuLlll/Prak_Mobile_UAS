const User = require('../models/User');
const History = require('../models/history');

// Fungsi untuk menambahkan saldo
exports.addBalance = async (req, res) => {
    const { userId, amountToAdd } = req.body;

    if (!userId || !amountToAdd) {
        return res.status(400).json({ message: 'Missing userId or amountToAdd' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.balance += parseFloat(amountToAdd);
        await user.save();

        // Simpan riwayat transaksi
        const history = new History({
            userId,
            type: 'add',
            amount: parseFloat(amountToAdd),
            fromUserName: 'System',
            toUserName: user.name
        });
        await history.save();

        res.status(200).json({ message: 'Balance updated successfully', newBalance: user.balance });
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Fungsi untuk mengirim saldo
exports.transferBalance = async (req, res) => {
    const { fromUserName, toUserName, amount } = req.body;

    if (!fromUserName || !toUserName || !amount) {
        return res.status(400).json({ message: 'Missing fromUserName, toUserName, or amount' });
    }

    try {
        // Cari pengguna berdasarkan nama
        const fromUser = await User.findOne({ name: fromUserName });
        const toUser = await User.findOne({ name: toUserName });

        if (!fromUser || !toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fromUser.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        fromUser.balance -= parseFloat(amount);
        toUser.balance += parseFloat(amount);

        await fromUser.save();
        await toUser.save();

        // Simpan riwayat transaksi
        const history = new History({
            userId: fromUser._id, // Gunakan _id dari pengguna yang ditemukan
            type: 'transfer',
            amount: parseFloat(amount),
            fromUserId: fromUser._id,
            toUserId: toUser._id,
            fromUserName: fromUser.name,
            toUserName: toUser.name
        });
        await history.save();

        return res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fungsi untuk mendapatkan riwayat transaksi
exports.getHistory = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
    }

    try {
        const history = await History.find({ userId }).sort({ date: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

