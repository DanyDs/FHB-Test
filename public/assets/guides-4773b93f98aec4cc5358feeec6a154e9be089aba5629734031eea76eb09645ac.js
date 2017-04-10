var serviceUrl = '/api/v1/';

var GuidesModel = function(_guides) {
    var self = this;
    /* Properties */
    self.guides = ko.observableArray(ko.utils.arrayMap(_guides, function(guide){
      return {
        id: guide.id,
        title: guide.title,
        name: guide.name,
        content: guide.content
      };
    }));
    console.log(self.guides());
    self.navigationStack = ko.observableArray();
    self.editableGuide= ko.observable(createNewGuide);
    self.createNewGuide=createNewGuide;
    self.editingGuideModel = ko.observable( createNewGuideObj() );

    /* Functions */
    self.removeGuide = removeGuide;
    self.createGuide = createGuide;
    self.updateGuide = updateGuide;

    self.openGuideToEdit = openGuideToEdit;
    self.openTitleGuideToEdit = openTitleGuideToEdit;


    self.returnToGuide = returnToGuide;

    function createGuide() {
        var data = JSON.stringify(self.editingGuideModel());
        var token = localStorage.getItem("Token");
        $.ajax({
            headers:{"Authorization": token},
            url:serviceUrl+"guides",
            type:"POST",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                self.guides.push(returnedData);
            },
            error: function(error, message) {
                if (error.status == 401)
                    location.href="/logins";
                else
                alert("Error guardando guia. " + error);
            }
        });

        self.editingGuideModel( createNewGuideObj() );

    };

    function updateGuide() {
        var guide = self.editableGuide();
        var data = JSON.stringify(guide);
        var token = localStorage.getItem("Token");
        console.log(guide.id);
        $.ajax({
            headers:{"Authorization": token},
            url:serviceUrl+"guides/"+ guide.id,
            type:"PUT",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                var i = self.guides.indexOf(guide);
                self.guides[i] = guide;
                document.location.href="/supervisor/guides";
            },
            error: function(error, message) {
                if (error.status == 401)
                    location.href="/logins";
                else
                alert("Error guardando guia. " + error);
            }
        });

        self.editableGuide( createNewGuide() );

    };

    function openGuideToEdit(guide) {
        self.editableGuide(guide);
        $('#editGuideDialog')
            .modal('show')
        ;
    }

    function openTitleGuideToEdit(guide) {
        self.editingGuideModel(guide);
        $('#editTitleGuideDialog')
            .modal('show')
        ;
    }

    function removeGuide(guide) {
      if (guide.title != null) {
        if (!confirm("Esta usted seguro que desea eliminar la guia '" + guide.title + "'"))
            return;
      }
      else {
        if (!confirm("Esta usted seguro que desea eliminar la guia '" + guide.name + "'"))
            return;
      }

        console.log(guide);
        var token = localStorage.getItem("Token");
        console.log(token);
        $.ajax({
            headers:{"Authorization": token},
            url: serviceUrl+"guides/"+ guide.id,
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                self.guides.pop(guide);
                location.href="/supervisor/guides";
            },
            error: function(error, message) {
                if (error.status == 401)
                    location.href="/logins";
                else
                alert("Error eliminando guia. " + error);
            }

        });
        self.guides.remove(guide);
    };

    function returnToGuide(guide) {

        do {
            var cat = self.navigationStack.pop();
        } while(cat != guide);

        showGuide(guide);
    }
    function createNewGuide(id,title,name,content)
    {
      if (!id) id = "";
      if (!name) name = "";
      if (!title) title = "";
      if (!content) content = "";
      newGuide = { "id" : id, "name" : name, "title": title, "content": content };

      return newGuide;
    }


    function createNewGuideObj(id, name, title, content)
    {
        return {"guide": {"id" : id,
                          "name" : name,
                          "title": title,
                          "content": content }} ;

        return newGuide;
    }






};
var guidesModel;
(function() {

    var jqxhr = $.getJSON(serviceUrl+"guides", function(data) {
        guidesModel = new GuidesModel(data);
        ko.applyBindings(guidesModel);
    });

})();
