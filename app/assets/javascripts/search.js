var serviceUrl = '/api/v1/';

var SearchModel = function() {
    var self = this;

    /* Properties */
    self.letterParams=ko.observable();
    self.filteredServicesProducts = ko.observableArray();


};


var searchModel;

(function() {
    var jqxhr = $.getJSON(serviceUrl+"search", function(data) {
        searchModel = new SearchModel(data);
        ko.applyBindings(searchModel);

    });
})();
