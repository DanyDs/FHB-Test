var serviceUrl = '/api/v1/';

var CategoriesModel = function(_categories) {
    var self = this;
console.log("hello from the other side");
    /* Properties */
    self.categories = ko.observableArray(ko.utils.arrayMap(_categories, function(category) {
        return {
            id: category.id,
            name: category.name
        };
    }));

    // self.editingCategoryModel = ko.observable( createNewCategoryObj() );

    /* Functions */
    // self.removeCategory = removeCategory;
    // self.createCategory = createCategory;

    // function createCategory() {
    //     var data = JSON.stringify(self.editingCategoryModel());
    //
    //     $.ajax({
    //         url:serviceUrl+"categories",
    //         type:"POST",
    //         data:data,
    //         contentType:"application/json; charset=utf-8",
    //         dataType:"json",
    //         success: function(returnedData){
    //             self.categories.push(returnedData);
    //         },
    //         error: function(error) {
    //             alert("Error guardando categoria. " + error);
    //         }
    //     });
    //
    //     self.editingCategoryModel( createNewCategoryObj() );
    //
    // };

    // function removeCategory(category) {
    //     $.ajax({
    //         url: serviceUrl+"categories/"+ category.id,
    //         type:"DELETE",
    //         contentType:"application/json; charset=utf-8",
    //         dataType:"json",
    //         success: function(returnedData){
    //             categories.pop(category);
    //         },
    //         error: function(error) {
    //             alert("Error eliminando categoria. " + error);
    //         }
    //
    //     });
    //     self.categories.remove(category);
    // };

    function createNewCategoryObj(id, name)
    {
        return { "category" : { "id" : id, "name" : name } };
    }
};


var categoriesModel;

(function() {

    var jqxhr = $.getJSON(serviceUrl+"categories", function(data) {
        categoriesModel = new CategoriesModel(data);
        ko.applyBindings(categoriesModel);
    });
})();
