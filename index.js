const path = require('path');
const async = require('async');
const newman = require('newman');
const beautify = require('json-beautify');
const fs = require('fs');

const postmanEnvFile = path.join(__dirname, 'postman/Wallex-Burhan-Local.postman_environment.json');
let rawData = fs.readFileSync(postmanEnvFile);
let postmanEnvironment = JSON.parse(rawData);
console.log('postmanEnvironment: ', postmanEnvironment);

const postmanEnvFile1 = path.join(__dirname, 'postman/Wallex Burhan - Local P1.postman_environment.json');
let rawData1 = fs.readFileSync(postmanEnvFile1);
let postmanEnvironment1 = JSON.parse(rawData1);

const postmanEnvFile2 = path.join(__dirname, 'postman/Wallex Burhan - Local P2.postman_environment.json');
let rawData2 = fs.readFileSync(postmanEnvFile2);
let postmanEnvironment2 = JSON.parse(rawData2);

const postmanEnvFile3 = path.join(__dirname, 'postman/Wallex Burhan - Local P3.postman_environment.json');
let rawData3 = fs.readFileSync(postmanEnvFile3);
let postmanEnvironment3 = JSON.parse(rawData3);

const postmanEnvFile4 = path.join(__dirname, 'postman/Wallex Burhan - Local P4.postman_environment.json');
let rawData4 = fs.readFileSync(postmanEnvFile4);
let postmanEnvironment4 = JSON.parse(rawData4);


const PARALLEL_RUN_COUNT = 2;

const parametersForSeed = {
    collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 1 - Seed.postman_collection.json'), // your collection
    environment: postmanEnvironment, //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

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
// console.log('POSTMAN_COLLECTIONS: ', POSTMAN_COLLECTIONS);

let parametersForTestRun1 = {
    // collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 2 - Accept.postman_collection.json'), // your collection
    environment: postmanEnvironment1, //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

let parametersForTestRun2 = {
    // collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 2 - Accept.postman_collection.json'), // your collection
    environment: postmanEnvironment2, //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

let parametersForTestRun3 = {
    // collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 2 - Accept.postman_collection.json'), // your collection
    environment: postmanEnvironment3, //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

let parametersForTestRun4 = {
    // collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 2 - Accept.postman_collection.json'), // your collection
    environment: postmanEnvironment4, //your env
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

// let commands2 = [
//     parallelCollectionRun1,
//     parallelCollectionRun2,
//     parallelCollectionRun3,
//     parallelCollectionRun4
// ];


let TRANSACTION_FUNDING_IDS = [];
let parallelCollectionRun1, parallelCollectionRun2, parallelCollectionRun3, parallelCollectionRun4;

new Promise((resolve, reject) => {
    // newman.run(parametersForSeed, resolve);
    newman.run(parametersForSeed, (err, summary) =>{
        // console.log('summary: ', summary);
        // console.log('>>>> summary e: ', summary.run.executions);

        summary.run.executions.forEach(execution => {
            // console.log('>>>> execution: ', execution);
            console.log(execution.item.name);
            // console.log('>>> response: ', execution.response.stream.toString());

            console.log('>>> request: ');
            // console.log(execution.request);
            console.log(execution.request.method);
            console.log(`${execution.request.url.protocol}://${execution.request.url.host.join('.')}:${execution.request.url.port}/${execution.request.url.path.join('/')}`);
            console.log('body: ');
            console.log(JSON.parse(execution.request.body.raw));

            console.log('>>> response: ');
            // console.log(execution.response.stream.toString());
            let result =  JSON.parse(execution.response.stream.toString());
            // console.log('result: ', result);
            console.log(beautify(result, null, 2, 100));

            // get idfunding
            if (result.idfunding) {
                console.log('>> idfunding: ', result.idfunding);
                TRANSACTION_FUNDING_IDS.push(result.idfunding.toString());
            }
            console.log('----------------------------------');
        });
        console.log('seeding success');
        console.log('TRANSACTION_FUNDING_IDS: ', TRANSACTION_FUNDING_IDS);

        parametersForTestRun1.environment.values[1].value = TRANSACTION_FUNDING_IDS[0];
        parametersForTestRun2.environment.values[1].value = TRANSACTION_FUNDING_IDS[1];
        parametersForTestRun3.environment.values[1].value = TRANSACTION_FUNDING_IDS[2];
        parametersForTestRun4.environment.values[1].value = TRANSACTION_FUNDING_IDS[3];

        console.log('parametersForTestRun1.environment: ', parametersForTestRun1.environment);
        console.log('parametersForTestRun2.environment: ', parametersForTestRun2.environment);
        console.log('parametersForTestRun3.environment: ', parametersForTestRun3.environment);
        console.log('parametersForTestRun4.environment: ', parametersForTestRun4.environment);

        parallelCollectionRun1 = (done) => {
            parametersForTestRun1.collection = path.join(__dirname, POSTMAN_COLLECTIONS[0]);

            newman.run(parametersForTestRun1, done);
        };
        parallelCollectionRun2 = (done) => {
            parametersForTestRun2.collection = path.join(__dirname, POSTMAN_COLLECTIONS[1]);

            newman.run(parametersForTestRun2, done);
        };
        parallelCollectionRun3 = (done) => {
            parametersForTestRun3.collection = path.join(__dirname, POSTMAN_COLLECTIONS[2]);

            newman.run(parametersForTestRun3, done);
        };
        parallelCollectionRun4 = (done) => {
            parametersForTestRun4.collection = path.join(__dirname, POSTMAN_COLLECTIONS[3]);

            newman.run(parametersForTestRun4, done);
        };


        return resolve([parallelCollectionRun1, parallelCollectionRun2, parallelCollectionRun3, parallelCollectionRun4]);
    });
}).then( parallelProccess => {
    return new Promise((resolve, reject) => {
        // Runs the Postman sample collection thrice, in parallel.
        async.parallel(
            parallelProccess,
            (err, results) => {
                if (err) {
                    reject(err)
                }

                // console.log('>>>>> result: ', results);
                results.forEach((result) => {
                    // console.log('>>>> result e: ', result.run.executions);
                    result.run.executions.forEach(execution => {
                        // console.log('>>>> execution: ', execution);
                        console.log(execution.item.name);
                        // console.log('>>> response: ', execution.response.stream.toString());

                        console.log('>>> request: ');
                        // console.log(execution.request);
                        console.log(execution.request.method);
                        console.log(`${execution.request.url.protocol}://${execution.request.url.host.join('.')}:${execution.request.url.port}/${execution.request.url.path.join('/')}`);
                        console.log('body: ');
                        console.log(JSON.parse(execution.request.body.raw));

                        console.log('>>> response: ');
                        // console.log(execution.response.stream.toString());
                        let result =  JSON.parse(execution.response.stream.toString());
                        // console.log('result: ', result);
                        console.log(beautify(result, null, 2, 100));

                        // get idfunding
                        if (result.idfunding) {
                            console.log('>> idfunding: ', result.idfunding);
                        }
                        console.log('----------------------------------');
                    });

                    let failures = result.run.failures;
                    console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                        `${result.collection.name} ran successfully.`);
                });
                resolve('OK!')
            });
    }).then( result => {
        console.log('test success');
    });
});
