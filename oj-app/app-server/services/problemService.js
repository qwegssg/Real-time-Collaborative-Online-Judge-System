var ProblemModel = require("../models/problemModel");

var getProblems = () => {
    return new Promise((resolve, reject) => {
        ProblemModel.find({}, (err, problems) => {
            if (err) {
                reject(err);
            } else {
                resolve(problems);
            }
        });
    });
}

var getProblem = (id) => {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({ id: id }, (err, problem) => {
            if (err) {
                reject(err);
            } else {
                resolve(problem);
            }
        });
    });
}

var addProblem = (newProblem) => {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({ name: newProblem.name }, (err, problem) => {
            if (problem) {
                reject("Problem name already exists.");
            } else {
                ProblemModel.countDocuments({}, (err, num) => {
                    if (err) {
                        reject(err);
                    } else {
                        newProblem.id = num + 1;
                        var mongoProblem = new ProblemModel(newProblem);
                        mongoProblem.save();
                        resolve(newProblem);
                    }
                });
            }
        });
    });
}

// export the object, then others can access the "getProblems" function of the object
module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem: addProblem
}