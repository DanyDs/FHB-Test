var serviceUrl = '/api/v1/';

var ProductsModel = function(_products) {
    var self = this;
    self.companyName = ko.observable(localStorage.getItem("CompanyName"));
    /* Properties */
    self.products = ko.observableArray(ko.utils.arrayMap(_products, function(product) {
        return {
            //id: product.id,
            //name: product.name
            id: product.id,
            commercial_name: product.commercial_name,
            feature: product.feature,
            description: product.description,
            image_path: product.image_path,
            tariff_position: product.tariff_position,
            certification: product.certification,
            visibility_state: product.visibility_state,
            company_id: product.company_id,
            category_id: product.category_id
        };
    }));

    self.editingProductModel = ko.observable( createNewProductObj() );
    self.navigationStack = ko.observableArray();
    self.productTypes = ko.observableArray();

    function loadProductTypes()
    {
        var jqxhr = $.getJSON(serviceUrl+"categories/tree", function(data) {
            self.productTypes(data);
        });
    }

    function loadProductSearch()
    {
        var jqxhr = $.getJSON(serviceUrl+"products", function(data) {
          
            self.productTypes(data);
        });
    }

    loadProductTypes();

    /* Functions */
    self.createProduct = createProduct;
    self.updateProduct = updateProduct;
    self.removeProduct = removeProduct;
    self.openProductToEdit = openProductToEdit;
    self.noErrors=noErrors;
    self.errorMessages = ko.observableArray();
    self.hasError=ko.observable(false);
    self.productImage=ko.observable();
    self.letterParams=ko.observable();
    function noErrors(){
      self.hasError(false);
      self.errorMessages("");
    }
    function createProduct() {
        self.errorMessages([]);
        self.hasError(false);
        self.editingProductModel().productData = $("#announcementPreview").attr("src");

        var data = JSON.stringify(self.editingProductModel());
        var token = localStorage.getItem("Token");
        if (!self.productImage()) {
              self.errorMessages.push("Suba la imagen del producto");
              self.hasError(true);
        }
        if (!self.editingProductModel().commercial_name)
            {self.errorMessages.push("Ingrese nombre del producto.");
            self.hasError(true);
             }
        if (!self.editingProductModel().description)
           {self.errorMessages.push("Ingrese descripción del producto.");
            self.hasError(true);
            }
        if (!self.editingProductModel().certification)
            {self.errorMessages.push("Ingrese cetificaciones del producto.");
            self.hasError(true);
             }
        if (!self.editingProductModel().tariff_position)
           {self.errorMessages.push("Ingrese posicion arancelaria del producto.");
            self.hasError(true);
            }
        if (self.hasError())
          return ;
        $.ajax({
            headers:{"Authorization": token},
            url:serviceUrl+"products",
            type:"POST",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                self.products.push(returnedData);
                $('#successMessage')
                    .modal('show')
                ;
            },
            error: function(error, message) {
                if (error.status == 401)
                    location.href="/logins";
                else
                alert("Error guardando producto. ");
            }
        });

        self.editingProductModel( createNewProductObj() );

    };
    function updateProduct(){
      self.errorMessages([]);
      self.hasError(false);
      var token = localStorage.getItem("Token");
      var product = self.editingProductModel();
      product.productData = $("#edit_announcementPreview").attr("src");
      var data = JSON.stringify(product);
      if (!self.editingProductModel().commercial_name)
          {self.errorMessages.push("Ingrese nombre del producto.");
          self.hasError(true);
           }
      if (!self.editingProductModel().description)
         {self.errorMessages.push("Ingrese descripción del producto.");
          self.hasError(true);
          }
      if (!self.editingProductModel().certification)
          {self.errorMessages.push("Ingrese cetificaciones del producto.");
          self.hasError(true);
           }
      if (!self.editingProductModel().tariff_position)
         {self.errorMessages.push("Ingrese posicion arancelaria del producto.");
          self.hasError(true);
          }
      if (self.hasError())
        return ;
      $.ajax({
          headers:{"Authorization": token},
          url:serviceUrl+"products/"+ product.id,
          type:"PUT",
          data:data,
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(returnedData){
              var i = self.products.indexOf(product);
              self.products[i] = product;
              document.location.href="/company/products";

          },
          error: function(error, message) {
              if (error.status == 401)
                   document.location.href="/logins";
              else{
                alert("Error al guardar producto. ");

              }
          }
      });

      self.editingProductModel( createNewProductObj() );
    };
    function openProductToEdit(product) {
        self.editingProductModel(product);
        $('#editProductDialog')
            .modal('show')
        ;
    }


/*------------------------------------------------------------*/

    function removeProduct(product) {
      var token = localStorage.getItem("Token");
      if (!confirm("Esta usted seguro que desea eliminar un producto?"))
          return;
        $.ajax({
            headers:{"Authorization": token},
            url: serviceUrl+"products/"+ product.id,
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                alert("Producto borrado con exito");
                products.pop(product);
            },
            error: function(error, message) {
                if (error.status == 401)
                     document.location.href="/logins";
                else{
                  alert("Error al eliminar producto. " + error);
                  document.location.href="/products";

                }
            }

        });
        self.products.remove(product);
    };



//*********************************************************************

    function createNewProductObj(id, commercial_name , feature , description , image_path , tariff_position , certification , visibility_state, category_id)
    {
      //if (!id) id = "";
      if (!commercial_name) commercial_name = "";
      if (!description) description = "";
      if (!tariff_position) tariff_position = "";
      if (!certification) certification = "";
      newProduct = { "id" : id, "commercial_name" : commercial_name, "feature" : feature, "description" : description,
                    "image_path" : image_path, "tariff_position" : tariff_position, "certification" :certification,
                    "visibility_state" : visibility_state , "company_id" : 8, "category_id" :category_id};
      return newProduct;

  }
};


var productsModel;

(function() {

    var token = localStorage.getItem("Token");
    var jqxhr = $.ajax({
        headers: {"Authorization": token},
        url: serviceUrl + "products",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            productsModel = new ProductsModel(data);
            ko.applyBindings(productsModel);
        },
        error: function(data, status) {
            if (status == "401")
                window.location.href = "/login";
            else
                alert("Ha ocurrido un error.")
        }
    });
})();
