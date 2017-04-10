var serviceUrl = '/api/v1/';
//-------------------------------------------------------------SERVICIOS -------------------------------------------------------------

var ServicesModel = function(_services) {
    var self_s = this;
    self.companyName = ko.observable(localStorage.getItem("CompanyName"));
    /* Properties */
    self_s.services = ko.observableArray(ko.utils.arrayMap(_services, function(service) {
        return {
            //id: category.id,
            //name: category.name
            id: service.id,
            commercial_name: service.commercial_name,
            feature: service.feature,
            description: service.description,
            image_path: service.image_path,
            tariff_position: service.tariff_position,
            certification: service.certification,
            visibility_state: service.visibility_state
        };
    }));

    self_s.editingServiceModel = ko.observable( createNewServiceObj() );

    self_s.navigationStack = ko.observableArray();
    self_s.serviceTypes = ko.observableArray();

    function loadServiceTypes()
    {
        var jqxhr = $.getJSON(serviceUrl+"categories/tree", function(data) {
            self_s.serviceTypes(data);
        });
    }

    loadServiceTypes();

    /* Functions */
    self_s.createService = createService;
    self_s.updateService = updateService;
    self_s.removeService = removeService;
    self_s.openServiceToEdit = openServiceToEdit;
    self_s.noErrors=noErrors;
    self_s.errorMessages = ko.observableArray();
    self_s.hasError=ko.observable(false);

    function noErrors(){
      self_s.hasError(false);
      self_s.errorMessages("");
    }

    function createService() {
      self_s.editingServiceModel().serviceData = $("#announcementPreview").attr("src");
      var data = JSON.stringify(self_s.editingServiceModel());
      var token = localStorage.getItem("Token");
      if (!self_s.editingServiceModel().commercial_name)
          {self_s.errorMessages.push("Ingrese nombre del servicio.");
          self_s.hasError(true);
           }
      if (!self_s.editingServiceModel().description)
         {self_s.errorMessages.push("Ingrese descripción del servicio.");
          self_s.hasError(true);
          }
      $.ajax({
          headers:{"Authorization": token},
          url:serviceUrl+"services",
          type:"POST",
          data:data,
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(returnedData){
              self_s.services.push(returnedData);
              $('#successMessage')
                  .modal('show')
              ;
          },
          error: function(error, message) {
              if (error.status == 401)
                  location.href="/logins";
              else
              alert("Error guardando servicio. " + error);
          }
      });

      self_s.editingServiceModel( createNewServiceObj() );

    };

    function updateService(){
      var token = localStorage.getItem("Token");
      var service = self_s.editingServiceModel();
      var data = JSON.stringify(service);

      $.ajax({
          headers:{"Authorization": token},
          url:serviceUrl+"services/"+ service.id,
          type:"PUT",
          data:data,
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(returnedData){
              var i = self_s.services.indexOf(service);
              self_s.services[i] = service;
          },
          error: function(error, message) {
              if (error.status == 401)
                   document.location.href="/logins";
              else{
                alert("Error al guardar servicio. " + error);
              }
          }
      });

      self_s.editingServiceModel( createNewServiceObj() );
    };

    function openServiceToEdit(service) {
        self_s.editingServiceModel(service);
        $('#editServiceDialog')
            .modal('show')
        ;
    };
/*-------------------------------REMOVE-----------------------------*/

function removeService(service) {
  var token = localStorage.getItem("Token");
  if (!confirm("Esta usted seguro que desea eliminar un servicio?"))
      return;
    $.ajax({
        headers:{"Authorization": token},
        url: serviceUrl+"services/"+ service.id,
        type:"DELETE",
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(returnedData){
            alert("Servicio borrado con exito");
            services.pop(service);
        },
        error: function(error, message) {
            if (error.status == 401)
                 document.location.href="/logins";
            else{
              alert("Error al eliminar servicio. " + error);
              document.location.href="/services";

            }
        }

    });
    self_s.services.remove(service);
};

//*********************************************************************

    function createNewServiceObj(id, commercial_name , feature , description , image_path , tariff_position , certification , visibility_state, company_id)
    {
      if (!commercial_name) commercial_name = "";
      if (!description) description = "";
      if (!tariff_position) tariff_position = "";
      if (!certification) certification = "";
      newService = { "id" : id, "commercial_name" : commercial_name, "feature" : feature, "description" : description,
                    "image_path" : image_path, "tariff_position" : tariff_position, "certification" :certification,
                    "visibility_state" : visibility_state , "company_id" : company_id};
      return newService;
    }
};


var servicesModel;

(function() {

    var token = localStorage.getItem("Token");
    var jqxhr = $.ajax({
        headers: {"Authorization": token},
        url: serviceUrl + "services",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            servicesModel = new ServicesModel(data);
            ko.applyBindings(servicesModel);
        },
        error: function(data, status) {
            if (status == "401")
                window.location.href = "/login";
            else
                alert("Ha ocurrido un error.")
        }
    });
})();
