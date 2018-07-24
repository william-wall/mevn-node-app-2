// let donations = require('../models/donations');
let express = require('express');
let router = express.Router();
var Donation = require('../models/donations');
let mongoose = require('mongoose');

var mongodbUri ='mongodb://william-wall:3d5ec03825@ds143971.mlab.com:43971/donationsdb';

mongoose.connect(mongodbUri);
let db = mongoose.connection;

// -- OLD -- router.findAll = (req, res) => {
//     // Return a JSON representation of our list
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(donations,null,5));
// }
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Donation.find(function(err, donations) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(donations,null,5));
    });
}
// --OLD-- router.findOne = (req, res) => {
//
//     res.setHeader('Content-Type', 'application/json');
//
//     var donation = getByValue(donations,req.params.id);
//
//     if (donation != null)
//         res.send(JSON.stringify(donation,null,5));
//     else
//         res.send('Donation NOT Found!!');
//
// }

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Donation.find({ "_id" : req.params.id },function(err, donation) {
        if (err)
            res.json({ message: 'Donation NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(donation,null,5));
    });
}

// function getByValue(array, id) {
//     var result  = array.filter(function(obj){return obj.id == id;} );
//     return result ? result[0] : null; // or undefined
// }

function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}

// --OLD-- router.addDonation = (req, res) => {
//     //Add a new donation to our list
//     var id = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an id
//     var currentSize = donations.length;
//
//     donations.push({"id" : id, "paymenttype" : req.body.paymenttype, "amount" : req.body.amount, "upvotes" : 0});
//
//     if((currentSize + 1) == donations.length)
//         res.json({ message: 'Donation Added Successfully!'});
//     else
//         res.json({ message: 'Donation NOT Added!'});
// }

router.addDonation = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var donation = new Donation();

    donation.paymenttype = req.body.paymenttype;
    donation.amount = req.body.amount;

    donation.save(function(err) {
        if (err)
            res.json({ message: 'Donation NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Donation Successfully Added!', data: donation });
    });
}

//--OLD-- router.incrementUpvotes = (req, res) => {
//     // Find the relevant donation based on params id passed in
//     // Add 1 to upvotes property of the selected donation based on its id
//     var donation = getByValue(donations,req.params.id);
//
//     if (donation != null) {
//         donation.upvotes += 1;
//         res.json({status : 200, message : 'UpVote Successful' , donation : donation });
//     }
//     else
//         res.send('Donation NOT Found - UpVote NOT Successful!!');
//
// }

router.incrementUpvotes = (req, res) => {

    Donation.findById(req.params.id, function(err,donation) {
        if (err)
            res.json({ message: 'Donation NOT Found!', errmsg : err } );
        else {
            donation.upvotes += 1;
            donation.save(function (err) {
                if (err)
                    res.json({ message: 'Donation NOT UpVoted!', errmsg : err } );
                else
                    res.json({ message: 'Donation Successfully Upvoted!', data: donation });
            });
        }
    });
}

//--OLD-- router.deleteDonation = (req, res) => {
//     //Delete the selected donation based on its id
//     var donation = getByValue(donations,req.params.id);
//     var index = donations.indexOf(donation);
//
//     var currentSize = donations.length;
//     donations.splice(index, 1);
//
//     if((currentSize - 1) == donations.length)
//         res.json({ message: 'Donation Deleted!'});
//     else
//         res.json({ message: 'Donation NOT Deleted!'});
// }

router.deleteDonation = (req, res) => {

    Donation.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Donation NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Donation Successfully Deleted!'});
    });
}

//--OLD-- router.findTotalVotes = (req, res) => {
//
//     let votes = getTotalVotes(donations);
//     res.json({totalvotes : votes});
// }

router.findTotalVotes = (req, res) => {

    Donation.find(function(err, donations) {
        if (err)
            res.send(err);
        else
            res.json({ totalvotes : getTotalVotes(donations) });
    });
}

// let mongoose = require('mongoose');



// mongoose.connect('mongodb://localhost:27017/donationsdb');

// let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

module.exports = router;

