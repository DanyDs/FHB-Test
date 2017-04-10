var serviceUrl= '/api/v1/';


var SuscribersModel = function(_suscribers){
  var self = this;
  self.suscribers = ko.observableArray(ko.utils.arrayMap(_suscribers, function(suscriber){
    return {
      id: suscriber.id,
      email: suscriber.email,
      code: suscriber.code,
    };
  }));


  self.editingSuscriber = ko.observable(createNewSuscriber());

    /*fuctions */
  self.createSuscriber = createSuscriber;


  function createSuscriber(){
    var data = JSON.stringify(self.editingSuscriber());
    $.ajax({
      url:serviceUrl+"suscribers",
      type: "POST",
      data:data,
      contentType: "application/json; charset= utf-8",
      dataType:"json",
      success: function (returnedData) {
        document.location.href="./";
      },
      error: function(error) {
        document.location.href="./";

      }
    });
    self.editingSuscriber(createNewSuscriber());

  };

     function createNewSuscriber(id,email,code) {
       return { "suscriber" : {"id":id,"email":email,"code":code}};
     }
};
var suscribersModel;
(function() {
    var jqxhr = $.getJSON(serviceUrl+"suscribers", function(data) {
        suscribersModel = new SuscribersModel(data);
        ko.applyBindings(suscribersModel);
    });
})();
