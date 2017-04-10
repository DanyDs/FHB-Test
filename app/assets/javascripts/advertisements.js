var serviceUrl = '/api/v1/';
var AdvertisementsModel = function (_advertisements) {
    var self = this;

    self.companyName = ko.observable(localStorage.getItem("CompanyName"));

    /* Properties */
    self.advertisements = ko.observableArray(_advertisements);
    self.navigationStack = ko.observableArray();
    self.editingAdvertisementModel = ko.observable(createNewAdvertisementObj());
    self.editingAd = ko.observable(createNewAdvertisementObj());
    self.errorMessages = ko.observableArray();
    self.hasError = ko.observable(false);
    self.showAdvertisements = ko.observableArray(_advertisements);
    self.showingAd = ko.observable(ko.utils.arrayMap(_advertisements, function (advertisement) {

        return {
            id: advertisement.id,
            description: advertisement.description,
            companyName: advertisement.companyName

        };
    }));
//imagen
    self.adImage = ko.observable();

    /* Functions */
    self.editAd = editAd;
    self.createAdvertisement = createAdvertisement;
    self.noErrors = noErrors;
    self.removeAdvertisement = removeAdvertisement;
    // self.updateAdvertisement = updateAdvertisement;
    self.showAdvertisement = showAdvertisement;
    self.returnToAdvertisement = returnToAdvertisement;

//aceptarRechazar
    self.declineAd = declineAd;
    self.acceptAd = acceptAd;

//------------FILTROS------------//
    //Filtros para supervisor

    self.regionalFilter = ko.observable();
    self.asRegionalAds = ko.computed(function () {

      function filterAds(advertisement) {
          if (filter){
              if (advertisement.expired === false) {
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
                  if (hoy > advertisement.expirationDate) {
                      advertisement.expired = true;
                  }
              }
            return advertisement.state == filter;
          }
          else
              return true;
      }

      var filter = null;
      if(self.regionalFilter() == "pendentsAnnouncementsButton")
          filter = "Pendiente";
      else if(self.regionalFilter() == "acceptedAnnouncementsButton")
          filter = "Aceptada";
      else
          filter = "Pendiente";

      return ko.utils.arrayFilter(self.advertisements(), filterAds).reverse().sort(function(advertisement){return advertisement.expired ? 1 : -1;});

    });



    ///Filtros para empresa
    self.companyFilter = ko.observable();
    self.asCompanyAds = ko.computed(function () {
        function filterAds(advertisement) {
            if (filter)
                return advertisement.state == filter;
            else
                return true;
        }

        var filter = null;
        if(self.companyFilter() == "requestedAnnouncementsButton")
            filter = "Pendiente";
        else if(self.companyFilter() == "acceptedAnnouncementsButton")
            filter = "Aceptada";
        else if(self.companyFilter() == "rejectedAnnouncementsButton")
            filter = "Rechazada";
        else
            filter = null;

        return ko.utils.arrayFilter(self.advertisements(), filterAds);
    });

    //filtro para visitante
    self.asVisitorAds = ko.computed(function () {
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
//------------ FIN FILTROS------------//


//------------MODALS------------//

    self.openDetail = openDetail;
    self.openToReject = openToReject;
    self.openAdvertisementToEdit = openAdvertisementToEdit;
    self.openView = openView;
    self.openSureAceptModal = openSureAceptModal;

    function openView(advertisement) {
        self.editingAd(advertisement);
        $('#visualizacionAnuncio')
            .modal('show');
    }
    function openDetail(advertisement) {
        self.showAdvertisement(advertisement);
        $('#modalFull')
            .modal('show');
        return self.showadvertisement;
    }
    function openToReject(advertisement) {
        $('.coupled.modal')
          .modal({
            allowMultiple: true
          })
        ;
        self.editingAd(advertisement);
        $('#rejectDialog')
            .modal('show').modal({
                onApprove: function () {
                    var n = document.getElementById('reason').value;
                    if (n.length < 1) {
                        openNoDetailModal();
                        return false;
                    }
                    openSureRejectModal();
                }
            });
    }
    function openAdvertisementToEdit(advertisement) {
        self.editingAd(advertisement);
        $('#editAdvertisementDialog')
            .modal('show');
    }
    function openNoDetailModal(){
        $('#sinMotivo').modal('show');
    }
    function openSureRejectModal(){
        $('#seguroRechazar').modal('show').modal({
            onApprove: declineAd
        })
        ;
    }
    function openRejectedModal(){
        $('#rechazado').modal('show');
    }
    function openErrorRejectModal(){
        $('#errorReject').modal('show');
    }

    function openSureAceptModal(advertisement){
        self.editingAd(advertisement);
        $('#seguroAceptar').modal('show').modal({
            onApprove: acceptAd
        });
    }
    function openAceptedModal(){
        $('#aceptado').modal('show');
    }
    function openErrorAceptModal(){
        $('#errorAcept').modal('show');
    }


//------------FIN MODALS------------//

    /* Functions */
    function noErrors() {
        self.hasError(false);
        self.errorMessages("");
    }
    function createAdvertisement() {
        self.errorMessages([]);
        self.hasError(false);
        self.editingAdvertisementModel().announcementData = $("#announcementPreview").attr("src");
        var data = JSON.stringify(self.editingAdvertisementModel());
        var token = localStorage.getItem("Token");
        if (!self.editingAdvertisementModel().description) {
            self.errorMessages.push("Falta ingresar descripción del anuncio.");
            self.hasError(true);
        }
        if (!self.editingAdvertisementModel().publicationDate) {
            self.errorMessages.push("Falta ingresar fecha de publicación de anuncio.");
            self.hasError(true);
        }
        if (!self.editingAdvertisementModel().expirationDate) {
            self.errorMessages.push("Falta ingresar fecha de expiración de anuncio.");
            self.hasError(true);
        }
        if (!self.adImage()) {
            self.errorMessages.push("Falta subir la imagen del anuncio");
            self.hasError(true);
        }
        if ((self.editingAdvertisementModel().publicationDate) > (self.editingAdvertisementModel().expirationDate)) {
            self.errorMessages.push("Fechas incorrectas, la fecha de publicación no puede ser después de la de expiración.");
            self.hasError(true);
        }

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
        if ((self.editingAdvertisementModel().expirationDate) < (hoy)) {
            self.errorMessages.push("Estas fechas ya pasaron.");
            self.hasError(true);
        }

        if (self.hasError())
            return false;

        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "advertisements",
            type: "POST",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                self.advertisements.push(returnedData);
                $('#successMessage')
                    .modal('show')
                ;
            },
            error: function (error, message) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error guardando anuncio. " + error);
            }
        });

        self.editingAdvertisementModel(createNewAdvertisementObj());

        return true;
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
                // self.advertisements.pop(returnedData);
                document.location.href="/company/advertisements";

            },
            error: function (error) {
                alert("Error eliminando anuncio. " + error);
            }

        });

        self.advertisements.remove(advertisement);

    }

    function returnToAdvertisement(advertisement) {
        var cat;
        do {
            cat = self.navigationStack.pop();
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
    function formatDateYMD(date) {
        var dateString = date.getFullYear() + "-";
        if (date.getMonth()+1 < 10)
            dateString += "0";

        dateString += (date.getMonth()+1) + "-";

        if (date.getDate() < 10)
            dateString += "0";
        dateString += date.getDate();

        return dateString;
    }
    function calculateExpirationAfterXDays(date, xDays){
        var newDate = new Date(date.setTime( date.getTime() + xDays * 86400000 ));
        return newDate;
    }
    function createNewAdvertisementObj(id, description, id_Company, isPublicized, publicationDate, expirationDate, state, reason, companyName) {
        if (!publicationDate) {
            publicationDate = formatDateYMD(new Date());
        }

        if (!expirationDate)
            expirationDate = formatDateYMD(calculateExpirationAfterXDays(new Date(publicationDate), 7));

        newAdvertisement = {
            "id": id,
            "description": description,
            "id_Company": id_Company,
            "isPublicized": isPublicized,
            "publicationDate": publicationDate,
            "expirationDate": expirationDate,
            "state": state,
            "reason": reason,
            "expired": false,
            "companyName": companyName
        };

        return newAdvertisement;
    }

    function editAd() {
        var token = localStorage.getItem("Token");
        var advertisement = self.editingAd();
        advertisement.announcementData = $("#edit_announcementPreview").attr("src");
        var data = JSON.stringify(advertisement);
        if (!self.editingAd().description) {
            confirm("Porfavor ingrese un descripción, esta no puede estar en blanco.");
            return false;
        }
        if (!self.editingAd().publicationDate) {
            confirm("Porfavor ingrese un fecha de publicación, esta no puede estar en blanco.");
            return false;
        }
        if (!self.editingAd().expirationDate) {
            confirm("Porfavor ingrese un fecha de fin de la publicación, esta no puede estar en blanco.");
            return false;
        }

        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "advertisements/" + advertisement.id,
            type: "PUT",
            data:data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
              var i = self.advertisements.indexOf(advertisement);
              self.advertisements[i] = advertisement;
              document.location.href="/company/advertisements";

            },
            error: function (error, message) {
                if (error.status == 401)
                    location.href = "/logins";
                else {
                    alert("Error guardando cambios. " + error.status);
                }
            }
        });
        self.editingAd( createNewAdvertisementObj() );
        return true;
    }



    //aceptarRechazar
    function declineAd() {
        var advertisement = self.editingAd();
        var error = false;

        var data = JSON.stringify(advertisement);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "advertisements/" + advertisement.id + "/decline",
            type: "PUT",
            data:data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                openRejectedModal();
            },
            error: function (error, message) {
                if (error.status == 401)
                    location.href = "/logins";
                else {
                    if (error.status == 200) {
                        openRejectedModal();
                    }
                    else {
                        openErrorRejectModal();
                    }

                }

            }

        });
    }

    function acceptAd() {
        var advertisement = self.editingAd();
        var error = false;

        var data = JSON.stringify(advertisement);
        var token = localStorage.getItem("Token");
            $.ajax({
            url: serviceUrl + "advertisements/" + advertisement.id + "/accept",
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                openAceptedModal();
            },
            error: function (error, message) {
                if (error.status == 401)
                    location.href = "/logins";
                else {
                    if (error.status == 200) {
                        openAceptedModal();
                    }
                    else {
                        openErrorAceptModal();
                    }

                }

            }
        });
    }

};

(function () {
    var token = localStorage.getItem("Token");

    var query = "advertisements";

    if (isCompanyPage)
        query = "companies/" + localStorage.getItem("CompanyId") + "/advertisements";

    if (isRegionalPage)
        query = "advertisements";

    if (isVisitorPage)
      query = "mainpage";

    var jqxhr = $.ajax({
        headers: {"Authorization": token},
        url: serviceUrl + query,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            advertisementsModel = new AdvertisementsModel(data);
            ko.applyBindings(advertisementsModel);
        },
        error: function (data, status) {
            if (status == "401")
                window.location.href = "/login";
            else
                alert("Ha ocurrido un error.");
        }
    });
})();
