var serviceUrl = '/api/v1/';

var CategoriesModel = function(_categories) {
    var self = this;

    /* Properties */
    self.categories = ko.observableArray(ko.utils.arrayMap(_categories, mapCategoryToObservable));
    self.navigationStack = ko.observableArray();
    self.editingCategoryModel = ko.observable( createNewCategoryObj() );

    /* Functions */
    self.removeCategory = removeCategory;
    self.createCategory = createCategory;
    self.updateCategory = updateCategory;

    self.openCategoryToEdit = openCategoryToEdit;

    self.showCategory = showCategory;
    self.returnToCategory = returnToCategory;
    self.clearNavigationStack = clearNavigationStack;
    function clearNavigationStack() {
        self.navigationStack([]);

        var jqxhr = $.getJSON(serviceUrl+"categories", function(data) {
            self.categories(data);
        });
    }

    /* Private functions */
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
                self.categories.push(mapCategoryToObservable(returnedData));
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
        var data = ko.toJSON(category);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers:{"Authorization": token},
            url:serviceUrl+"categories/"+ category.id,
            type:"PUT",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                var i =0;
                var arr = self.categories();

                for(i in arr)
                {
                    if (arr[i].id == category.id)
                        break;
                }

                //var i = self.categories.indexOf(category);
                self.categories()[i].name(category.name());
            },
            error: function(error) {
                alert("Error guardando categoria. " + error);
            }
        });

        self.editingCategoryModel( createNewCategoryObj() );

    };

    function openCategoryToEdit(category) {
        self.editingCategoryModel(createNewCategoryObj(category.id, category.name()));

        $('#editCategoryDialog').modal('show');
    }

    function removeCategory(category) {
        if (!confirm("Esta usted seguro que desea eliminar la categoria '" + category.name() + "'"))
            return;

        var token = localStorage.getItem("Token");
        $.ajax({
            headers:{"Authorization": token},
            url: serviceUrl+"categories/"+ category.id,
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                //self.categories.pop(category);
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
            self.categories(ko.utils.arrayMap(data, mapCategoryToObservable));
        });
    }

    function createNewCategoryObj(id, name)
    {
        if (!id) id = "";
        if (!name) name = "";

        var current = self.navigationStack()[self.navigationStack().length-1];
        if (!current) categoryId = "";
        else categoryId = current.id;

        newCategory = { "id" : id, "name": ko.observable(name), "category_id": categoryId  };

        return newCategory;
    }

    function mapCategoryToObservable(category) {
        return {
            id: category.id,
            name: ko.observable(category.name),
            category_id: category.category_id
        };
    }
};

(function() {

    var jqxhr = $.getJSON(serviceUrl+"categories", function(data) {
        categoriesModel = new CategoriesModel(data);
        ko.applyBindings(categoriesModel);
    });

})();
