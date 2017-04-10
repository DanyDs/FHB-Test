var serviceUrl = '/api/v1/';
var AdvertisementsModel = function (_advertisements) {
    var self = this;

    self.companyName = ko.observable(localStorage.getItem("CompanyName"));

    /* Properties */
    self.advertisements = ko.observableArray(_advertisements);
    self.navigationStack = ko.observableArray();
    self.editingAdvertisementModel = ko.observable(createNewAdvertisementObj());
    self.editingAd = ko.observable(createNewAdvertisementObj());
    self.editAd=editAd;
    /* Functions */

    self.createAdvertisement = createAdvertisement;
    self.noErrors=noErrors;
    self.errorMessages = ko.observableArray();
    self.hasError=ko.observable(false);
    self.removeAdvertisement = removeAdvertisement;
    // self.updateAdvertisement = updateAdvertisement;

    self.showAdvertisement = showAdvertisement;
    self.showAdvertisements = ko.observableArray(_advertisements);
    self.showingAd=ko.observable(ko.utils.arrayMap(_advertisements, function(advertisement){

      return {
        id: advertisement.id,
        description: advertisement.description,
        companyName: advertisement.companyName

      };
    }));
    self.returnToAdvertisement = returnToAdvertisement;
//imagen
  self.adImage=ko.observable();

//aceptarRechazar
    self.declineAd =declineAd;
    self.acceptAd =acceptAd;

//Filtros
//Filtros para supervisor
self.requestedAds= ko.computed(function(){

  return ko.utils.arrayFilter(self.advertisements(),function(advertisement){
    return advertisement.state=="Pendiente" ;
  });
});
self.acceptedAds= ko.computed(function(){

  return ko.utils.arrayFilter(self.advertisements(),function(advertisement){
    return advertisement.state=="Aceptada" ;
  });
});
 ///Filtros para empresa
self.asCompanyAds= ko.computed(function(){
  var CoId = localStorage.getItem("CompanyId");

  return ko.utils.arrayFilter(self.advertisements(),function(advertisement){
    return advertisement.id_Company==CoId ;
  });
});
self.asCompanyRequestedAds= ko.computed(function(){
  var CoId = localStorage.getItem("CompanyId");

  return ko.utils.arrayFilter(self.advertisements(),function(advertisement){
    return advertisement.id_Company==CoId && advertisement.state=="Pendiente"  ;
  });
});
self.asCompanyAcceptedAds= ko.computed(function(){
  var CoId = localStorage.getItem("CompanyId");

  return ko.utils.arrayFilter(self.advertisements(),function(advertisement){
    return advertisement.id_Company==CoId && advertisement.state=="Aceptada"  ;
  });
});
self.asCompanyRejectedAds= ko.computed(function(){
  var CoId = localStorage.getItem("CompanyId");

  return ko.utils.arrayFilter(self.advertisements(),function(advertisement){
    return advertisement.id_Company==CoId && advertisement.state=="Rechazada"  ;
  });
});
//filtro para visitante
self.asVisitorAds= ko.computed(function(){
  var CoId = localStorage.getItem("CompanyId");
  var hoy = new Date();

  var dd = hoy.getDate();
  var mm = hoy.getMonth()+1; //hoy es 0!
  var yyyy = hoy.getFullYear();

  if(dd<10) {
      dd='0'+dd
  }

  if(mm<10) {
      mm='0'+mm
  }

  hoy = yyyy+'-'+mm+'-'+dd;

  return ko.utils.arrayFilter(self.advertisements(),function(advertisement){
    return advertisement.state=="Aceptada" && (advertisement.publicationDate >= hoy || hoy <= advertisement.expirationDate) ;

  });
});
//MODALS
    self.openToReject=openToReject;
    self.openToEditAd=openToEditAd;
    self.openDetail=openDetail;
    self.openAdvertisementToEdit = openAdvertisementToEdit;

/* Functions */
    function noErrors(){
      self.hasError(false);
      self.errorMessages("");
    }
    function createAdvertisement() {
      self.errorMessages([]);
      self.hasError(false);
        self.editingAdvertisementModel().announcementData = $("#announcementPreview").attr("src");
        var data = JSON.stringify(self.editingAdvertisementModel());
        var token = localStorage.getItem("Token");
        if (!self.editingAdvertisementModel().description)
            {self.errorMessages.push("Falta ingresar descripcion del anuncio.");
            self.hasError(true);
             }
        if (!self.editingAdvertisementModel().publicationDate)
            {self.errorMessages.push("Falta ingresar fecha de publicacion de anuncio.");
             self.hasError(true);
            }
        if (!self.editingAdvertisementModel().expirationDate)
            {self.errorMessages.push("Falta ingresar fecha de expiracion de anuncio.");
             self.hasError(true);
            }
        if (!self.adImage()) {
            self.errorMessages.push("Falta subir la imagen del anuncio");
            self.hasError(true);
            }
        if (self.hasError())
            return ;
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
    function createNewAdvertisementObj(id, description, id_Company, isPublicized, publicationDate, expirationDate, state, reason, companyName) {
        newAdvertisement = {
            "id": id,
            "description": description,
            "id_Company": id_Company,
            "isPublicized": isPublicized,
            "isPublicized": isPublicized,
            "publicationDate": publicationDate,
            "expirationDate": expirationDate,
            "state": state,
            "reason": reason,
            "companyName": companyName
        };

        return newAdvertisement;
    }

    function editAd(){
      var advertisement =  self.editingAdvertisementModel();
      var data = JSON.stringify(advertisement);
      var token = localStorage.getItem("Token");
      $.ajax({
        headers:{"Authorization": token},
        url:  serviceUrl + "advertisements/" + advertisement.id,
        type:"PUT",
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(returnedData){

        },
        error: function(error, message) {
            if (error.status == 401)
                location.href = "/logins";
            else{
                alert("Error guardando cambios. " + error.status);

              }

            }
      });
    }

//modals
    function openDetail(advertisement){
      self.showAdvertisement(advertisement);
      $('#modalFull')
        .modal('show');
        return self.showadvertisement ;
    }
    function openToReject(advertisement){
      self.editingAd(advertisement);
      $('#rejectDialog')
        .modal('show');
    }
    function openToEditAd(advertisement){
      self.editingAd(advertisement);
      $('#EditDialog')
        .modal('show');
    }
    function openAdvertisementToEdit(advertisement) {
        self.editingAdvertisementModel(advertisement);
        $('#editAdvertisementDialog')
            .modal('show');
    }

    //aceptarRechazar
    function declineAd() {
        var advertisement =  self.editingAd();
        var error = false;
        if (!self.editingAd().reason)
            {
              confirm("Porfavor ingrese un motivo");
              return;
            }

        if (!confirm(("Esta usted seguro que desea rechazar el anuncio: '" + advertisement.description )))
          return;

        var data = JSON.stringify(advertisement);
        var token = localStorage.getItem("Token");
        $.ajax({
          headers:{"Authorization": token},
          url:  serviceUrl + "advertisements/" + advertisement.id+ "/decline",
          type:"PUT",
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(returnedData){
            alert("El anuncio ha sido rechazado");
            location.href="/acceptDecline";
          },
          error: function(error, message) {
              if (error.status == 401)
                  location.href = "/logins";
              else
              {
                if (error.status == 200)
                {
                  alert("El anuncio ha sido rechazado");
                  location.href="/acceptDecline";
                }
                else {
                  alert("Error aceptando anuncio. " + error.status);

                }

              }

          }

        });
   }

   function acceptAd(advertisement) {
     if (!confirm("Esta usted seguro que desea aceptar el anuncio ." + advertisement.description + "'"))
       return;

       $.ajax({
         url:  serviceUrl + "advertisements/" + advertisement.id + "/accept",
         type:"PUT",
         contentType:"application/json; charset=utf-8",
         dataType:"json",
         success: function(returnedData){
           alert("El anuncio ha sido aceptado");
           location.href="/acceptDecline";
         },
         error: function(error, message) {
             if (error.status == 401)
                 location.href = "/logins";
             else
             {
               if (error.status == 200)
               {
                 alert("El anuncio ha sido aceptado");
                 location.href="/acceptDecline";
               }
               else {
                 alert("Error aceptando anuncio. " + error.status);

               }

             }

         }
       });
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
