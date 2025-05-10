(function(window){
    window = window || {};

    function get(name){
        try{
            let chartData = localStorage.getItem(name);
            return chartData? JSON.parse(chartData) : {};
        }catch(e){
            return null;
        }
    }

    function set(name, data){
        try{
            localStorage.setItem(name, JSON.stringify(data));
            return true
        }catch(e){
            return false;
        }
        
    }

    window.StoreService = {
        get: get,
        set: set
    }
})(window);