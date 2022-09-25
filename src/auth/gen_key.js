'use strict'
const crypto = require('crypto');
const fs = require('fs');
const key_file_name = 'registered_keys.json';

let hash = function (data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Generate new keys
let base_key = crypto.randomBytes(48).toString('hex')
let windows_base_key = hash(base_key + 'windows');
let linux_base_key = hash(base_key + 'linux');
let darwin_base_key = hash(base_key + 'darwin');
let id = hash(base_key);

// Read in existing data if exists
if(fs.existsSync(key_file_name)) {
    let raw = fs.readFileSync(key_file_name).toString()
    let json = JSON.parse(raw);

    // Add new key
    json[id] = {
        "base": base_key,
        "windows_base" : windows_base_key,
        "linux_base": linux_base_key,
        "darwin_base_key": darwin_base_key
    };

    // Write new data
    let data = JSON.stringify(json, null, 2);
    fs.writeFileSync(key_file_name, data);
    console.log("New key created, add it to your module for authentication.");
    console.log("Authentication will only take place with environmental keys");
    console.log("Send POST requests with SHA(above-key + env) as auth token");
    console.log("Ex: SHA(key1linux) or SHA(key2windows) will work. Encode in hex prior to ");
    console.log(`Plaintext  : "${base_key}"`)

} else {
    console.log("keyfile not found");
}
