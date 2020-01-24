const path = require('path');
const async = require('async');
const newman = require('newman');

const parametersForSeed = {
    collection: path.join(__dirname, 'postman/Seq Funding Accept v2 - 1 - Seed.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/Wallex-Burhan-Local.postman_environment.json'), //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

const seed = async (done) => {
    newman.run(parametersForSeed, done);
};


seed();
