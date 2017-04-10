var serviceUrl= '/api/v1/';

var SubsidiariesModel = function(_subsidiaries){
  var self = this;
  self.subsidiaries = ko.observableArray(ko.utils.arrayMap(_subsidiaries, function(subsidiary){
    return {
      id: subsidiary.id,
      address: subsidiary.address,
      created_at: subsidiary.created_at,
      auxId: subsidiary.auxId,
    };
  }));


  self.editingSubsidiary = ko.observable(createNewSubsidiary());

    /*fuctions */
  self.createSubsidiary = createSubsidiary;


  function createSubsidiary(){
    var data = JSON.stringify(self.editingSubsidiary());
    $.ajax({
      url:serviceUrl+"subsidiaries",
      type: "POST",
      data:data,
      contentType: "application/json; charset= utf-8",
      dataType:"json",
      success: function (returnedData) {
        alert("Categoria creada");

      },
      error: function(error) {


      }
    });
    self.editingSubsidiary(createNewsubsidiary());

  };

     function createNewsubsidiary(id,address,created_at,auxId) {
       return { "subsidiary" : {"id":id,"address":address,"auxId":auxId,"created_at":created_at,}};
     }
};
var subsidiariesModel;
(function() {
    var jqxhr = $.getJSON(serviceUrl+"subsidiaries", function(data) {
        subsidiariesModel = new SubsidiariesModel(data);
        ko.applyBindings(subsidiariesModel);
    });
})();
