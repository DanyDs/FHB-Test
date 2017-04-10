var serviceUrl = '/api/v1/';

var CategoriesModel = function(_categories) {
    var self = this;
    /* Properties */
    self.categories = ko.observableArray(_categories);

    self.navigationStack = ko.observableArray();

    self.editingCategoryModel = ko.observable( createNewCategoryObj() );

    /* Functions */
    self.removeCategory = removeCategory;
    self.createCategory = createCategory;
    self.updateCategory = updateCategory;

    self.openCategoryToEdit = openCategoryToEdit;

    self.showCategory = showCategory;
    self.returnToCategory = returnToCategory;

    function createCategory() {
        var data = JSON.stringify(self.editingCategoryModel());
        var token = localStorage.getItem("Token");
        $.ajax({
            headers:{"Authorization": token},
            url:serviceUrl+"categories",
            type:"POST",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                self.categories.push(returnedData);
            },
            error: function(error, message) {
                if (error.status == 401)
                    location.href="/logins";
                else
                alert("Error guardando categoria. " + error);
            }
        });

        self.editingCategoryModel( createNewCategoryObj() );
        
    };

    function updateCategory() {
        var category = self.editingCategoryModel();
        var data = JSON.stringify(category);

        $.ajax({
            url:serviceUrl+"categories/"+ category.id,
            type:"PUT",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                var i = self.categories.indexOf(category);
                self.categories[i] = category;
            },
            error: function(error) {
                alert("Error guardando categoria. " + error);
            }
        });

        self.editingCategoryModel( createNewCategoryObj() );

    };

    function openCategoryToEdit(category) {
        self.editingCategoryModel(category);

        $('#editCategoryDialog')
            .modal('show')
        ;
    }

    function removeCategory(category) {
        if (!confirm("Esta usted seguro que desea eliminar la categoria '" + category.name + "'"))
            return;

        $.ajax({
            url: serviceUrl+"categories/"+ category.id,
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                categories.pop(category);
            },
            error: function(error) {
                alert("Error eliminando categoria. " + error);
            }

        });
        self.categories.remove(category);
    };

    function returnToCategory(category) {

        do {
            var cat = self.navigationStack.pop();
        } while(cat != category);

        showCategory(category);
    }

    function showCategory(category) {
        self.navigationStack.push(category);
        self.editingCategoryModel(createNewCategoryObj());

        var jqxhr = $.getJSON(serviceUrl+"categories/"+category.id, function(data) {
            self.categories(data);
        });
    }

    function createNewCategoryObj(id, name)
    {
        if (!id) id = "";
        if (!name) name = "";

        var current = self.navigationStack()[self.navigationStack().length-1];
        if (!current) categoryId = "";
        else categoryId = current.id;

        newCategory = { "id" : id, "name" : name, "category_id": categoryId  };

        return newCategory;
    }


};

(function() {

    var jqxhr = $.getJSON(serviceUrl+"categories", function(data) {
        categoriesModel = new CategoriesModel(data);
        ko.applyBindings(categoriesModel);
    });
  
})();


