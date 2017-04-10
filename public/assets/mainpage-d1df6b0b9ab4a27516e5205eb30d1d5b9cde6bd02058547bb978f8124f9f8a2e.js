var serviceUrl = '/api/v1/';

var AdvertisementsModel = function(_advertisements) {
    var self = this;

    /* Properties */
    self.advertisements = ko.observableArray(ko.utils.arrayMap(_advertisements, function(advertisement) {
        return {
            id: advertisement.id,
            description: advertisement.description
        };
    }));

    self.showAdvertisements = ko.observableArray(_advertisements);


    /* Functions */

   function createNewAdvertisementObj(id, description, publicationDate,expirationDate)
    {
      newAdvertisement = { "id" : id, "description": description, "publicationDate" : publicationDate,"expirationDate" : expirationDate};

     return newAdvertisement;
    }

};

var advertisementModel;

(function() {

    var jqxhr = $.getJSON( "visualize_ads", function(data) {
        advertisementModel = new AdvertisementsModel(data);
        ko.applyBindings(advertisementModel);
    });
})();
