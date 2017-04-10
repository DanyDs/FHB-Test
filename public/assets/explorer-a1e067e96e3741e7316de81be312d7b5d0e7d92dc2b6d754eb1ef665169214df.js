var serviceUrl = '/api/v1/';

var ExplorerModel = function() {
    var self = this;

    /* Properties */
    self.categories = ko.observableArray();
    self.navigationStack = ko.observableArray();

    self.filteredCompanies = ko.observableArray();
    self.filteredProducts = ko.observableArray();
    self.filteredServices = ko.observableArray();


    /* Functions */
    self.showCategory = showCategory;
    self.returnToCategory = returnToCategory;
    self.clearNavigationStack = clearNavigationStack;

    function clearNavigationStack() {
        self.navigationStack([]);

        var jqxhr = $.getJSON(serviceUrl+"categories", function(data) {
            self.categories(data);
        });
    }

    function returnToCategory(category) {

        do {
            var cat = self.navigationStack.pop();
        } while(cat != category);

        showCategory(category);
    }

    function showCategory(category) {
        self.categories([]);

		self.filteredCompanies([]);
		self.filteredProducts([]);
		self.filteredServices([]);

        self.navigationStack.push(category);
        
        var jqxhr = $.getJSON(serviceUrl+"categories/"+category.id, function(data) {
            self.categories(data);
        });
		
		loadResults(category.id);
    }
	
	function loadResults(categoryId)
	{
		var jqxhr = $.getJSON(serviceUrl+"categories/" + categoryId + "/companies", function(data) {
			explorerModel.filteredCompanies(data);
		});

		var jqxhr = $.getJSON(serviceUrl+"categories/" + categoryId + "/products", function(data) {
			explorerModel.filteredProducts(data);
		});

		var jqxhr = $.getJSON(serviceUrl+"categories/" + categoryId + "/services", function(data) {
			explorerModel.filteredServices(data);
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


var explorerModel = new ExplorerModel();

(function() {
    ko.applyBindings(explorerModel);

    var jqxhr = $.getJSON(serviceUrl+"categories", function(data) {
      explorerModel.categories(data);
    });
})();


