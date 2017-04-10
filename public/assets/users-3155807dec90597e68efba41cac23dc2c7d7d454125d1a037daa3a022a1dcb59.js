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
    self.updatePassword = updatePassword;
    self.editablePassword = ko.observable(createNewPasswordEditable);

    function createUser() {
        var data = JSON.stringify(self.editingUserModel());
        var token = localStorage.getItem("Token");
        $.ajax({
            headers:{"Authorization": token},
            url:serviceUrl+"users",
            type:"POST",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                self.users.push(returnedData);
                location.href = ("/users");
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

    function createNewUser(id,email,name,last_name, username,address,department,company_id, rol, password) {
       if(!id) id="";
       if(!email) email="";
       if(!name) name="";
       if(!last_name) last_name="";
       if(!username) username="";
       if(!address) address="";
       if(!department) department="";
       if(!company_id) company_id="";
       if(!rol) rol="";
       if(!password) password ="";
       var current= self.navigationStack()[self.navigationStack().length-1];
       if(!current) userId="";
       else userId= current.id;
       newUser = {   "id" : id,
                     "email" : email,
                     "name" : name,
                     "last_name" : last_name,
                     "username" : username,
                     "address" : address,
                     "department" : department,
                     "company_id" : company_id,
                     "rol" : rol,
                     "password" : password
                   };
       return newUser;
     }

     function createNewPasswordEditable(new_email, new_name, new_last_name, new_address, new_department, option, password, new_password, new_password_confirmation) {
       if(!new_email) new_email="";
       if(!new_name) new_name="";
       if(!new_last_name) new_last_name="";
       if(!new_address) new_address="";
       if(!new_department) new_department="";
       if(!password) password="";
       if(!new_password) new_password="";
       if(!new_password_confirmation) new_password_confirmation="";
       if(!option) option="";
       var current= self.navigationStack()[self.navigationStack().length-1];
       if(!current) userId="";
       else userId= current.id;
       newUser = {
                     "new_email" : new_email,
                     "new_name" : new_name,
                     "new_last_name" : new_last_name,
                     "new_address" : new_address,
                     "new_department" : new_department,
                     "option" : option,
                     "password" : password,
                     "new_password" : new_password,
                     "new_password_confirmation" : new_password_confirmation
                   };
       return newUser;
     }

     function updatePassword(){
        var user = self.editablePassword();
        var id = localStorage.getItem("user");
        //console.log(localStorage.getItem("user"));
        user.id = 1;
        var data = JSON.stringify(user);

        var token = localStorage.getItem("Token");
         console.log(data);
        $.ajax({
            headers:{"Authorization": token},
            url:serviceUrl+"users/"+1,
            type:"PUT",
            data:data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(returnedData){
                alert("Nueva contraseña cambiada con exito");

            },
            error: function(error) {
                alert("Error cambiar contraseña " + error);
            }
        });
        self.editablePassword(createNewPasswordEditable() );
     }

    function createNewUserObj(id, email, name, last_name, username, address, department, company_id, rol, password)
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
                 "password" : password,
                 "rol" : rol
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
