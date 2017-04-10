var serviceUrl = '/api/v1/';

var AdvertisementsModel = function(_advertisements) {
    var self = this;

    /* Properties */
    self.advertisements = ko.observableArray(_advertisements);

    self.showAdvertisements = ko.observableArray(_advertisements);
    self.asMainpageAds = ko.computed(function () {
        var hoy = new Date();

        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        hoy = yyyy + '-' + mm + '-' + dd;

        return ko.utils.arrayFilter(self.advertisements(), function (advertisement) {
            return advertisement.state == "Aceptada" && (advertisement.publicationDate >= hoy || hoy <= advertisement.expirationDate);

        });
    });

    /* Functions */

   function createNewAdvertisementObj(id, description, publicationDate,expirationDate)
    {
      newAdvertisement = { "id" : id, "description": description, "publicationDate" : publicationDate,"expirationDate" : expirationDate};

     return newAdvertisement;
    }

};

var advertisementModel;

(function() {
    var jqxhr = $.getJSON(serviceUrl+"mainpage", function(data) {
        advertisementModel = new AdvertisementsModel(data);
        ko.applyBindings(advertisementModel);
    });

})();
