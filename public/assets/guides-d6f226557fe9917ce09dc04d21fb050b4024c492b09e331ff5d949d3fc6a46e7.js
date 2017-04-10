var serviceUrl = '/api/v1/';

var GuidesModel = function(_guides) {
    var self = this;
    /* Properties */
    self.guides = ko.observableArray(_guides);

    self.navigationStack = ko.observableArray();

    self.editingGuideModel = ko.observable( createNewGuideObj() );

    /* Functions */
    self.removeGuide = removeGuide;
    self.createGuide = createGuide;
    self.updateGuide = updateGuide;

    self.openGuideToEdit = openGuideToEdit;
    self.openTitleGuideToEdit = openTitleGuideToEdit;

    self.showGuide = showGuide;
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
            error: function(error) {
              if (error.status == 401)
                  location.href="/logins";
              else
                alert("Error guardando categoria. " + error);
            }
        });

        self.editingGuideModel( createNewGuideObj() );

    };

    function updateGuide() {

        var guide = self.editingGuideModel();
        var data = JSON.stringify(guide);
        var token = localStorage.getItem("Token");
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
                location.href="/guides";

            },
            error: function(error) {
              if (error.status == 401 || error.status == 500)
                  location.href="/logins";
              else
                alert("Error guardando guia. " + error);
            }
        });

        self.editingGuideModel( createNewGuideObj() );

    };

    function openGuideToEdit(guide) {
        self.editingGuideModel(guide);

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
        if (!confirm("Esta usted seguro que desea eliminar la categoria '" + guide.name + "'"))
            return;
        var token = localStorage.getItem("Token");
        $.ajax({
            headers:{"Authorization": token},
            url: serviceUrl+"guides/"+ guide.id,
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                self.guides.pop(guide);
                location.href = "/guides";
            },
            error: function(error) {
              if (error.status == 401 || error.status == 500)
                  location.href="/logins";
              else
                alert("Error eliminando guia " + error + guide.id);
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

    function showGuide(guide) {
        self.navigationStack.push(guide);
        self.editingGuideModel(createNewGuideObj());

        var jqxhr = $.getJSON(serviceUrl+"guides/"+guide.id, function(data) {
            self.guides(data);
        });
    }

    function createNewGuideObj(id, name)
    {
        if (!id) id = "";
        if (!name) name = "";

        var current = self.navigationStack()[self.navigationStack().length-1];
        if (!current) categoryId = "";
        else categoryId = current.id;

        newGuide = { "id" : id, "name" : name, "category_id": categoryId  };

        return newGuide;
    }


};

(function() {

    var jqxhr = $.getJSON(serviceUrl+"guides", function(data) {
        guidesModel = new GuidesModel(data);
        ko.applyBindings(guidesModel);
    });

})();
