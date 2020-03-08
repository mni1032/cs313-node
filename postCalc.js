function calcStampRate(weight) {
    if (weight <= 1) {
        return 0.55;
    }
    else if (weight <= 2) {
        return 0.7;
    }
    else if (weight <= 3) {
        return 0.85;
    }
    else if (weight <= 3.5) {
        return 1;
    }
}

function calcMeterRate(weight) {
    if (weight <= 1) {
        return 0.5;
    }
    else if (weight <= 2) {
        return 0.65;
    }
    else if (weight <= 3) {
        return 0.8;
    }
    else if (weight <= 3.5) {
        return 0.95;
    }
}

function calcFlatRate(weight) {
    if (weight <= 1) {
        return 1;
    }
    else if (weight <= 2) {
        return 1.2;
    }
    else if (weight <= 3) {
        return 1.4;
    }
    else if (weight <= 4) {
        return 1.6;
    }
    else if (weight <= 5) {
        return 1.8;
    }
    else if (weight <= 6) {
        return 2;
    }
    else if (weight <= 7) {
        return 2.2;
    }
    else if (weight <= 8) {
        return 2.4;
    }
    else if (weight <= 9) {
        return 2.6;
    }
    else if (weight <= 10) {
        return 2.8;
    }
    else if (weight <= 11) {
        return 3;
    }
    else if (weight <= 12) {
        return 3.2;
    }
    else if (weight <= 13) {
        return 3.4;
    }
}

function calcRetailRate(weight) {
    if (weight <= 1) {
        return 3.8;
    }
    else if (weight <= 2) {
        return 3.8;
    }
    else if (weight <= 3) {
        return 3.8;
    }
    else if (weight <= 4) {
        return 3.8;
    }
    else if (weight <= 5) {
        return 4.6;
    }
    else if (weight <= 6) {
        return 4.6;
    }
    else if (weight <= 7) {
        return 4.6;
    }
    else if (weight <= 8) {
        return 4.6;
    }
    else if (weight <= 9) {
        return 5.3;
    }
    else if (weight <= 10) {
        return 5.3;
    }
    else if (weight <= 11) {
        return 5.3;
    }
    else if (weight <= 12) {
        return 5.3;
    }
    else if (weight <= 13) {
        return 5.9;
    }
}

function calcRate(req, res) {
    var weight = req.query.weight;
    var type = req.query.type;

    var rate = 0;
    if (type == "stamp") {
        rate = calcStampRate(weight);
    }

    if (type == "meter") {
        rate = calcMeterRate(weight);
    }

    if (type == "flat") {
        rate = calcFlatRate(weight);
    }

    if (type == "retail") {
        rate = calcRetailRate(weight);
    }

    rate = Number.parseFloat(rate).toFixed(2);
    var details = {weight: weight, rate: rate};
    res.render('pages/postCalcRate', details);
}

module.exports = {calcRate: calcRate};