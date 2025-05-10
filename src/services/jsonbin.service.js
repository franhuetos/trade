

(function(window){
    window = window || {};

    let JSON_BIN = "";
    let MASTER_KEY = '';

    async function config(url, masterKey){
        JSON_BIN = url;
        MASTER_KEY = masterKey;
    }

    async function get(){
        const getOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY }
        };
        const getData = await fetch(JSON_BIN, getOptions);
        const response = await getData.json();
        return response.record;
    }

    async function set(data){
        const putOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
            body: JSON.stringify(data)
        };
        let putData = await fetch(JSON_BIN, putOptions);
        const response = await putData.json();
        return response;
    }

    window.JSONBIN = {
        config: config,
        get: get,
        set: set
    }
})(window);