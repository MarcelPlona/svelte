const express = require('express');
const jwt = require('jsonwebtoken')

const getDb = require('../util/db').getDb;
const router = express.Router();

router.post('/api/add',  (req, res) => {

    if (req.body.data !== undefined) {
        const db = getDb();
        db.collection('bases').insertOne(req.body.data, function (err, resp) {
            if (err) throw err;
            res.status(200).json({ res: "y" });
        });

    }
    else {
        res.status(200).json({ res: "n" });
    }


});

router.get('/api/projects/:project',  (req, res) => {

    const db = getDb();
    db.collection('bases').find({ name: req.params.project }).toArray(function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
    });
});

router.all('/api/change-mark',  (req, res) => {
    if (req.body.name !== undefined) {
        const db = getDb();
        const tech_to_update = "persons.$[prop]." + req.body.tech;

        db.collection('bases').updateOne({ name: req.body.name }, { $set: { [tech_to_update]: req.body.value } }, {
            arrayFilters: [{
                "prop._id": req.body.person_id
            }]
        }, function (err, res) {
            if (err) throw err;
        });
        res.status(200).json({ res: "y" });
    }
    else {
        res.status(200).json({ res: "n" });
    }
});

router.all('/api/change-tech-view',  (req, res) => {
    if (req.body.name !== undefined) {
            const db = getDb();
            if (req.body.old_value) {
                db.collection('bases').updateOne({ name: req.body.name, tech_list_view: req.body.old_value }, { $set: { "tech_list_view.$": req.body.value } }, function (err, res) {
                    if (err) throw err;
                });
            }
            else if (req.body.end_or_start) {
                if (req.body.end_or_start == "start") {
                    db.collection('bases').updateOne({ name: req.body.name }, { $set: { "data_start": req.body.value } }, function (err, res) {
                        if (err) throw err;
                    });
                }
                else if (req.body.end_or_start == "end") {
                    db.collection('bases').updateOne({ name: req.body.name }, { $set: { "data_end": req.body.value } }, function (err, res) {
                        if (err) throw err;
                    });
                }
            }
        res.status(200).json({ res: "y" });
    }
    else {
        res.status(200).json({ res: "n" });
    }
});



router.get('/api/projects',  (req, res) => {

        const db = getDb();
        const projection = { name: 1 };
        db.collection('bases').find({}).project(projection).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });
});


router.all('/api',  (req, res) => {
        const db = getDb();

        db.collection('bases').find({ name: "test10" }).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });
});

module.exports = router;