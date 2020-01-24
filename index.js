const path = require('path');
const async = require('async');
const newman = require('newman');
const beautify = require('json-beautify');

const PARALLEL_RUN_COUNT = 2;

// const parametersForSeed = {
//     collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 1 - Seed.postman_collection.json'), // your collection
//     environment: path.join(__dirname, 'postman/Wallex-Burhan-Local.postman_environment.json'), //your env
//     // reporters: 'json', // cli, json, junit, progress and emojitrain
//     reporters: 'cli', // cli, json, junit, progress and emojitrain
//     color: 'off' // on, off and auto
// };
//
//
// const seed = async (done) => {
//     console.log('>>> seed');
//     newman.run(parametersForSeed, done);
// };


const POSTMAN_COLLECTIONS = [
    'postman/Seq Funding Accept v2 - 2 - 1 - Accept.postman_collection.json',
    'postman/Seq Funding Accept v2 - 2 - 2 - Accept.postman_collection.json',
    'postman/Seq Funding Accept v2 - 2 - 3 - Accept.postman_collection.json',
    'postman/Seq Funding Accept v2 - 2 - 4 - Accept.postman_collection.json'
];
console.log('POSTMAN_COLLECTIONS: ', POSTMAN_COLLECTIONS);


let parametersForTestRun = {
    // collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 2 - Accept.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/Wallex-Burhan-Local.postman_environment.json'), //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

// parallelCollectionRun = (done) => {
//     newman.run(parametersForTestRun, done);
// };

// let commands = [];
// for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
//     commands.push(parallelCollectionRun);
// }

// console.log('commands: ', commands);


const parallelCollectionRun1 = (done) => {
    parametersForTestRun.collection = path.join(__dirname, POSTMAN_COLLECTIONS[0]);
    newman.run(parametersForTestRun, done);
};
const parallelCollectionRun2 = (done) => {
    parametersForTestRun.collection = path.join(__dirname, POSTMAN_COLLECTIONS[1]);
    newman.run(parametersForTestRun, done);
};
const parallelCollectionRun3 = (done) => {
    parametersForTestRun.collection = path.join(__dirname, POSTMAN_COLLECTIONS[2]);
    newman.run(parametersForTestRun, done);
};
const parallelCollectionRun4 = (done) => {
    parametersForTestRun.collection = path.join(__dirname, POSTMAN_COLLECTIONS[3]);
    newman.run(parametersForTestRun, done);
};

let commands2 = [
    parallelCollectionRun1,
    parallelCollectionRun2,
    parallelCollectionRun3,
    parallelCollectionRun4
];

console.log('commands2: ', commands2);

// Runs the Postman sample collection thrice, in parallel.
async.parallel(
    // commands,
    commands2,
    (err, results) => {
        err && console.error(err);
        // console.log('>>>>> result: ', results);
        results.forEach((result) => {
            // console.log('>>>> result e: ', result.run.executions);
            result.run.executions.forEach(execution => {
                // console.log('>>>> execution: ', execution);
                // console.log('>>> response: ', execution.response.stream.toString());
                console.log('>>> request: ');
                // console.log(execution.request);
                console.log(`${execution.request.url.protocol}://${execution.request.url.host.join('.')}:${execution.request.url.port}/${execution.request.url.path.join('/')}`);
                console.log('>>> response: ');
                // console.log(execution.response.stream.toString());
                let result =  JSON.parse(execution.response.stream.toString());
                // console.log('result: ', result);
                console.log(beautify(result, null, 2, 100));
            });

            let failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
        });
    });
