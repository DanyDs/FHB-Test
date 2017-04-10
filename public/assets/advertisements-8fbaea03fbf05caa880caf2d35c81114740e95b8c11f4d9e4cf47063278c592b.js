var serviceUrl = '/api/v1/';
var AdvertisementsModel = function (_advertisements) {
    var self = this;

    self.companyName = ko.observable(localStorage.getItem("CompanyName"));

    /* Properties */
    self.advertisements = ko.observableArray(_advertisements);

    self.navigationStack = ko.observableArray();

    self.editingAdvertisementModel = ko.observable(createNewAdvertisementObj());

    /* Functions */
    self.createAdvertisement = createAdvertisement;
    self.removeAdvertisement = removeAdvertisement;
    // self.updateAdvertisement = updateAdvertisement;

    self.openAdvertisementToEdit = openAdvertisementToEdit;

    self.showAdvertisement = showAdvertisement;
    self.returnToAdvertisement = returnToAdvertisement;

    function createAdvertisement() {
        self.editingAdvertisementModel().announcementData = $("#announcementPreview").attr("src");
        var data = JSON.stringify(self.editingAdvertisementModel());
        var token = localStorage.getItem("Token");

        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "advertisements",
            type: "POST",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                self.advertisements.push(returnedData);
            },
            error: function (error, message) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error guardando anuncio. " + error);
            }
        });

        self.editingAdvertisementModel(createNewAdvertisementObj());
    }


    function openAdvertisementToEdit(advertisement) {
        self.editingAdvertisementModel(advertisement);


        $('#editAdvertisementDialog')
            .modal('show');
    }

    function removeAdvertisement(advertisement) {
        if (!confirm("Esta usted seguro que desea eliminar el anuncio '" + advertisement.description + "'"))
            return;
        $.ajax({
            url: serviceUrl + "advertisements/" + advertisement.id,
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                advertisements.pop(returnedData);
            },
            error: function (error) {
                alert("Error eliminando anuncio. " + error);
            }

        });

        self.advertisements.remove(advertisement);

    };
    function returnToAdvertisement(advertisement) {

        do {
            var cat = self.navigationStack.pop();
        } while (cat != advertisement);

        showAdvertisement(advertisement);
    }

    function showAdvertisement(advertisement) {
        self.navigationStack.push(advertisement);
        self.editingAdvertisementModel(createNewAdvertisementObj());

        var jqxhr = $.getJSON(serviceUrl + "advertisements/" + advertisement.id, function (data) {
            self.advertisements(data);
        });
    }

    function createNewAdvertisementObj(id, description, publicationDate, expirationDate) {
        newAdvertisement = {
            "id": id,
            "description": description,
            "publicationDate": publicationDate,
            "expirationDate": expirationDate
        };

        return newAdvertisement;
    }
};

(function () {

    var token = localStorage.getItem("Token");
    var jqxhr = $.ajax({
        headers: {"Authorization": token},
        url: serviceUrl + "advertisements",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            advertisementsModel = new AdvertisementsModel(data);
            ko.applyBindings(advertisementsModel);
        },
        error: function(data, status) {
            if (status == "401")
                window.location.href = "/login";
            else
                alert("Ha ocurrido un error.")
        }
    });
})();
