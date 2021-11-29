const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mg = require('mongodb').MongoClient;
const url = "mongodb+srv://user:pass@cluster00.hve3n.mongodb.net/table?retryWrites=true&w=majority";
const dbname = "table";

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});




app.post('/api/add', (req, res) => {

    if (req.body.data !== undefined) {
        mg.connect(url, {}, (error, client) => {
            if (error) {
                console.log("Błąd ,", error);
            }
            const db = client.db(dbname);
            db.collection('bases').insertOne(req.body.data, function (err, res) {
                if (err) throw err;
            });
        });
        res.status(200).json({ res: "y" });
    }
    else {
        res.status(200).json({ res: "n" });
    }


});

app.get('/api/projects/:project', (req, res) => {

    mg.connect(url, {}, (error, client) => {
        if (error) {
            console.log("Błąd ,", error);
        }
        const db = client.db(dbname);
        db.collection('bases').find({ name: req.params.project }).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });

    });
});

app.all('/api/change-mark', (req, res) => {
    if (req.body.name !== undefined) {
        mg.connect(url, {}, (error, client) => {
            if (error) {
                console.log("Błąd ,", error);
            }

            let tech_to_update = "persons.$[prop]." + req.body.tech;

            const db = client.db(dbname);
            db.collection('bases').updateOne({ name: req.body.name }, { $set: { [tech_to_update]: req.body.value } }, {
                arrayFilters: [{
                    "prop._id": req.body.person_id
                }]
            }, function (err, res) {
                if (err) throw err;
            });
        });
        res.status(200).json({ res: "y" });
    }
    else {
        res.status(200).json({ res: "n" });
    }
});

app.all('/api/change-tech-view', (req, res) => {
    if (req.body.name !== undefined) {
        mg.connect(url, {}, (error, client) => {
            if (error) {
                console.log("Błąd ,", error);
            }
            const db = client.db(dbname);
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


        });
        res.status(200).json({ res: "y" });
    }
    else {
        res.status(200).json({ res: "n" });
    }
});



app.get('/api/projects', (req, res) => {

    mg.connect(url, {}, (error, client) => {
        if (error) {
            console.log("Błąd ,", error);
        }
        const db = client.db(dbname);
        const projection = { name: 1 };
        db.collection('bases').find({}).project(projection).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });

    });
});


app.all('/api', (req, res) => {

    mg.connect(url, {}, (error, client) => {
        if (error) {
            console.log("Błąd ,", error);
        }

        const db = client.db(dbname);
        db.collection('bases').find({ name: "test10" }).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });

    });
});

app.listen(3000, () => {
    console.log("Serwer chodzi!");
});