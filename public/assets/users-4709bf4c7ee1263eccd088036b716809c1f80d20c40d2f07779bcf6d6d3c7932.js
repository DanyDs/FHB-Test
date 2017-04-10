var serviceUrl = '/api/v1/';

var UsersModel = function(_users) {
    var self = this;

    /* Properties */
    self.users = ko.observableArray(_users);
    self.navigationStack = ko.observableArray();
    self.editingUserModel = ko.observable( createNewUserObj() );

    /* Functions */
    self.removeUser = removeUser;
    self.createUser = createUser;
    self.showUser = showUser;
    self.returnToUser = returnToUser;
    self.openUserToEdit = openUserToEdit;
    self.createNewUser = createNewUser;

    function createUser() {
        var data = JSON.stringify(self.editingUserModel());

        $.ajax({
            url:serviceUrl+"users",
            type:"POST",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                self.users.push(returnedData);
            },
            error: function(error) {
                alert("Error guardando usuario. " + error);
            }
        });

        self.editingUserModel( createNewUserObj() );

    };

    function removeUser(user) {
        $.ajax({
            url: serviceUrl+"users/"+ user.id,
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                users.pop(user);
            },
            error: function(error) {
                alert("Error eliminando categoria. " + error);
            }

        });
        self.users.remove(user);
    };

    function openUserToEdit(user) {
        self.editingUserModel(user);

        $('#editUserDialog')
            .modal('show')
        ;
    }
    
    function returnToUser(user) {

        do {
            var use = self.navigationStack.pop();
        } while(use != user);

        showUser(user);
    }

    function showUser(user) {
        self.navigationStack.push(user);
        self.editingUserModel(createNewUser());

        var jqxhr = $.getJSON(serviceUrl+"users/"+user.id, function(data) {
            self.users(data);
        });
    }

    function createNewUser(id,email,name,last_name, username,address,department,company_id) {
       if(!id) id="";
       if(!email) email="";
       if(!name) name="";
       if(!last_name) last_name="";
       if(!username) username="";
       if(!address) address="";
       if(!department) department="";
       if(!company_id) company_id="";       
       var current= self.navigationStack()[self.navigationStack().length-1];
       if(!current) userId="";
       else userId= current.id;
       newUser = { "id" : id,
                     "email" : email,
                     "name" : name,
                     "last_name" : last_name,
                     "username" : username,
                     "address" : address,
                     "department" : department,
                     "company_id" : company_id
                   };
       return newUser;
     }

    function createNewUserObj(id, email, name, last_name, username, address, department, company_id)
    {
        return { "user" : 
                { "id" : id, 
                 "email" : email, 
                 "name" : name, 
                 "last_name" : last_name, 
                 "username" : username,
                  "address" : address,
                  "department" : department,
                  "company_id" : company_id,
                 "password" : "A123456", 
                 "password_confirmation" : "A123456" 
                } 
             };
    }
};


var usersModel;

(function() {

    var jqxhr = $.getJSON(serviceUrl+"users", function(data) {
        usersModel = new UsersModel(data);
        ko.applyBindings(usersModel);
    });
})();
