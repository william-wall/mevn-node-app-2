let mongoose = require('mongoose');

let DonationSchema = new mongoose.Schema({
        paymenttype: String,
        amount: Number,
        upvotes: {type: Number, default: 0}
    },
    { collection: 'donationsdb' });

module.exports = mongoose.model('Donation', DonationSchema);