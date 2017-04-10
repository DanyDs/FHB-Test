var AdvertisementsModel = function(_advertisements) {
    var self = this;

    /* Properties */
    self.advertisements = ko.observableArray(ko.utils.arrayMap(_advertisements, function(advertisement) {
        return {
            id: advertisement.id,
            description: advertisement.description,
            publicationDate: advertisement.publicationDate,
            expirationDate: advertisement.expirationDate
        };
    }));

    self.editingAdvertisementModel = ko.observable( createNewAdvertisementObj() );

    /* Functions */

   function createNewAdvertisementObj(id)
    {
        return { "advertisement" : { "id" : id } };
    }

      function accept(advertisement) {
        if (!confirm("Esta usted seguro que desea aceptar el anuncio '" + advertisement.description + "'"))
          return;
        $.ajax({
          url:  "advertisements/" + advertisement.id + "/accept",
          type:"POST",
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(returnedData){
            var i = self.advertisements.indexOf(advertisement);
            self.advertisements[i] = advertisement;
            location.href="/supervisor/acceptDecline";

          },
          error: function(error) {
              alert("Error aceptando anuncio. " + error);
          }

        });
        };

     function decline(advertisement) {

    }
};

var advertisementModel;

(function() {

    var jqxhr = $.getJSON("acceptDecline", function(data) {
        advertisementModel = new AdvertisementsModel(data);
        ko.applyBindings(advertisementModel);
    });
})();
