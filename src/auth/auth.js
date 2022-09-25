const crypto = require('crypto');
const fs = require('fs');

module.exports.isAuthorized  = function(req) {
    const key_file_name = './auth/registered_keys.json';
    // If response includes auth token (using environmental keying)
    /*
        USER will manually add key to registered_key for each module
     */

    if(!req.query.key){
        return false;
    }
    // Generate lookup values
    let reqKey = req.query.key;
    // let reqId = crypto.createHash('sha256').update(reqKey).digest('hex');

    // Read in existing data if exists
    if(fs.existsSync(key_file_name)) {
        let raw = fs.readFileSync(key_file_name).toString()
        let json = JSON.parse(raw);

        // Key structure
        // json[id] = {
        //     "base": base_key,
        //     "windows_base" : windows_base_key,
        //     "linux_base": linux_base_key,
        //     "darwin_base_key": darwin_base_key
        // };

        // If key is valid (matching any existing key) then continue
        for(let key in json) {
            if(reqKey.includes(key)) {
                console.log("auth!")
                return true;
            }
        }
        return false;
    }
    return false;
}