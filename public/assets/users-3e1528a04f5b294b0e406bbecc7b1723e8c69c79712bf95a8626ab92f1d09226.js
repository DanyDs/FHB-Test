var serviceUrl = '/api/v1/';
var UsersModel = function (_users) {
    var self = this;

    /* Properties */
    self.users = ko.observableArray(_users);
    self.navigationStack = ko.observableArray();
    self.editingUserModel = ko.observable(createNewUserObj());
    self.errorMessages = ko.observableArray();
    self.hasError = ko.observable(false);
    self.selectedDepartments = ko.observable();
    self.editablePassword = ko.observable(createNewPasswordEditable());
    self.editableUser = ko.observable(createNewUserEditable());

    /* Functions */
    self.updateUserPassword = updateUserPassword;
    self.lockUser = lockUser;
    self.removeUser = removeUser;
    self.createUser = createUser;
    self.showUser = showUser;
    self.returnToUser = returnToUser;
    self.openUserToEdit = openUserToEdit;
    self.createNewUser = createNewUser;
    self.updatePassword = updatePassword;
    self.updateUser = updateUser;
    self.errorMessages = ko.observableArray();
    self.hasError=ko.observable(false);
    self.noErrors=noErrors;
    self.verifyPassword=verifyPassword;
    self.selectedDepartments=ko.observable();
    self.editablePassword = ko.observable(createNewPasswordEditable());
    self.editableUser = ko.observable(createNewUserEditable());
     function noErrors(){
    self.hasError(false);
    self.errorMessages("");
    self.noErrors = noErrors;
    }
    function verifyPassword(){
      self.hasError(false);
      self.errorMessages([]);
      var user= self.editingUserModel();
      user.lock=null;
      user.password="";
      var token = localStorage.getItem("Token");
      var pass1 = user.new_password;
      var pass2 = user.new_password_confirmation;
        if (pass1 != pass2) {
          self.errorMessages.push("Las nuevas contraseñas no coinciden");
          self.hasError(true);
        }
        if (!pass1 || !pass2 ) {
          self.errorMessages.push("Ingrese nueva contraseña");
          self.hasError(true);

        }
        if ((pass1.length <7 || pass2.length<7) && pass1 != "" && pass2 != "" ) {
          self.errorMessages.push("Ingrese una nueva contraseña con minimo 7 caracteres");
          self.hasError(true);
         }
        var checkpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
        var checkPass1 = checkpass.test(pass1);
        var checkPass2 = checkpass.test(pass2);
        if ((!checkPass1 || !checkPass2) && pass1 != "" && pass2 != "") {
            self.errorMessages.push("Ingrese una nueva contraseña con al menos una letra mayuscula, un digito y un caracter especial");
            self.hasError(true);
        }
        if (self.hasError()){
          return ;
        }
        self.updateUserPassword();
        $('#editUserDialog')
            .modal('hide')
        ;
    }
    function updateUserPassword() {
        self.hasError(false);
        self.errorMessages([]);

        var user = self.editingUserModel();
        user.lock = null;
        user.password = "";

        var pass1 = user.new_password;
        var pass2 = user.new_password_confirmation;
        if (pass1 != pass2) {
            self.errorMessages.push("Las nuevas contraseñas no coinciden");
            self.hasError(true);
        }

        if (!pass1 || !pass2) {
            self.errorMessages.push("Ingrese nueva contraseña");
            self.hasError(true);

        }

        if ((pass1.length < 7 || pass2.length < 7) && pass1 != "" && pass2 != "") {
            self.errorMessages.push("Ingrese una nueva contraseña con mínimo 7 caracteres");
            self.hasError(true);
        }

        var checkpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
        var checkPass1 = checkpass.test(pass1);
        var checkPass2 = checkpass.test(pass2);

        if ((!checkPass1 || !checkPass2) && pass1 != "" && pass2 != "") {
            self.errorMessages.push("Ingrese una nueva contraseña con al menos una letra mayúscula, un dígito y un caracter especial");
            self.hasError(true);
        }
        if (self.hasError()){
          return false;
        }

      var data= JSON.stringify(user);
      var token = localStorage.getItem("Token");
      $.ajax({
        headers:{"Authorization": token},
        url:serviceUrl+"users/"+ user.id,
        type:"PUT",
        data:data,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(returnedData){
            alert("La contraseña se modifico exitosamente");
            var i = self.users.indexOf(user);
            self.users[i] = user;
            location.href="/users";
          },
        error: function(error) {
          if (error.status == 401){
              alert("error 401");
              location.href="/logins";
          }
          else{
            alert("Error al cambiar contraseña usuario. " + error);
          }
        }
      });
      return true;
    }

    function lockUser(user) {
        user.lock = !user.lock;

        var data = JSON.stringify(user);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "users/" + user.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("Los derechos del usuario han sido modificados");
                var i = self.users.indexOf(user);
                self.users[i] = user;
                location.href = "/users";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error al bloquear usuario. " + error);
            }
        });
    }

    function createUser() {
        self.editingUserModel().user.department = self.selectedDepartments().toString();
        var data = JSON.stringify(self.editingUserModel());
        var token = localStorage.getItem("Token");
        self.hasError(false);
        self.errorMessages([]);
        if (!self.editingUserModel().user.email) {
            self.errorMessages.push("Ingrese un correo electronico");
            self.hasError(true);
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var OK = re.test(self.editingUserModel().user.email);
        if (!OK) {
            self.errorMessages.push("Ingrese un correo electronico válido");
            self.hasError(true);
        }
        var emailCreado = ko.utils.arrayFirst(self.users(), function (user) {
            return user.email === self.editingUserModel().user.email;
        });

        if (emailCreado) {
            self.errorMessages.push("Esta correo electronico ya esta siendo utilizada");
            self.hasError(true);
        }
        if (!self.editingUserModel().user.name) {
            self.errorMessages.push("Ingrese un nombre");
            self.hasError(true);
        }
        if (!self.editingUserModel().user.last_name) {
            self.errorMessages.push("Ingrese un apellido");
            self.hasError(true);
        }

        if (!self.editingUserModel().user.password) {
            self.errorMessages.push("Ingrese una contraseña");
            self.hasError(true);
        }
        var con = self.editingUserModel().user.password_confirmation;
        if (self.editingUserModel().user.password != self.editingUserModel().user.password_confirmation) {
            self.errorMessages.push("Las contraseñas no coinciden");
            self.hasError(true);
        }
        if (self.editingUserModel().user.password.length < 7) {
            self.errorMessages.push("Ingrese una contraseña con mínimo 7 caracteres");
            self.hasError(true);
        }
        var checkpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
        var pass = checkpass.test(self.editingUserModel().user.password);
        if (!pass) {
            self.errorMessages.push("Ingrese una contraseña con al menos una letra mayúscula, un dígito y un caracter especial");
            self.hasError(true);
        }
        if (!self.editingUserModel().user.department) {
            self.errorMessages.push("Ingrese un departamento");
            self.hasError(true);
        }
        if (self.hasError()) {
            return;
        }
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "users",
            type: "POST",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                self.users.push(returnedData);
                location.href = ("/users");
            },
            error: function (error) {
                alert("Error guardando usuario. " + error);
            }
        });
        self.editingUserModel(createNewUserObj());
    }

    function removeUser(user) {
        $.ajax({
            url: serviceUrl + "users/" + user.id,
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                users.pop(user);
            },
            error: function (error) {
                alert("Error eliminando categoria. " + error);
            }
        });
        self.users.remove(user);
    }

    function openUserToEdit(user) {
        self.editingUserModel(user);
        $('#editUserDialog')
            .modal('show')
        ;
    }

    function returnToUser(user) {
        do {
            var use = self.navigationStack.pop();
        } while (use != user);
        showUser(user);
    }

    function showUser(user) {
        self.navigationStack.push(user);
        self.editingUserModel(createNewUser());
        var jqxhr = $.getJSON(serviceUrl + "users/" + user.id, function (data) {
            self.users(data);
        });
    }

    function createNewUser(id, email, name, last_name, username, department, company_id, rol, password, password_confirmation) {
        if (!id) id = "";
        if (!email) email = "";
        if (!name) name = "";
        if (!last_name) last_name = "";
        if (!username) username = "";
        if (!department) department = "";
        if (!company_id) company_id = "";
        if (!rol) rol = "";
        if (!password) password = "";
        if (!password_confirmation) password_confirmation = "";
        var current = self.navigationStack()[self.navigationStack().length - 1];
        if (!current) userId = "";
        else userId = current.id;
        newUser = {
            "id": id,
            "email": email,
            "name": name,
            "last_name": last_name,
            "username": username,
            "department": department,
            "company_id": company_id,
            "rol": rol,
            "password": password,
            "password_confirmation": password_confirmation
        };
        return newUser;
    }

    function createNewUserEditable(id, new_name, new_last_name, new_department, password, new_password, new_password_confirmation) {
        if (!new_name) new_name = "";
        if (!new_last_name) new_last_name = "";
        if (!new_department) new_department = "";
        if (!password) password = "";
        if (!new_password) new_password = "";
        if (!new_password_confirmation) new_password_confirmation = "";
        var current = self.navigationStack()[self.navigationStack().length - 1];
        if (!current) userId = "";
        else userId = current.id;
        newUser = {
            "id": id,
            "new_name": new_name,
            "new_last_name": new_last_name,
            "new_department": new_department,
            "password": password,
            "new_password": new_password,
            "new_password_confirmation": new_password_confirmation
        };
        return newUser;
    }

    function createNewPasswordEditable(id, password, new_password, new_password_confirmation) {

        if (!password) password = "";
        if (!new_password) new_password = "";
        if (!new_password_confirmation) new_password_confirmation = "";
        var current = self.navigationStack()[self.navigationStack().length - 1];
        if (!current) userId = "";
        else userId = current.id;
        newUser = {
            "id": id,
            "password": password,
            "new_password": new_password,
            "new_password_confirmation": new_password_confirmation
        };
        return newUser;
    }

    function updateUser() {
        self.hasError(false);
        self.errorMessages([]);
        var user = self.editableUser();
        var id = localStorage.getItem("userId");

        if (self.hasError()) {
            return;
        }

        var data = JSON.stringify(user);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "users/" + id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                window.localStorage.setItem("department", returnedData.department);
                window.localStorage.setItem("UserName", returnedData.name + " " + returnedData.last_name);
                window.localStorage.setItem("uName", returnedData.name);
                window.localStorage.setItem("userLast", returnedData.last_name);
                alert("Cambio de datos exitoso");
                var role = window.localStorage.getItem("UserRole");
                if (role == "general") {
                    location.href = ("/administrator/users/editUser");
                    return;
                };
                if (role == "regional") {
                    location.href = ("/supervisor/editUser");
                    return;
                };
                location.href = ("/company/editUser");

            },
            error: function (error) {
                alert("Error cambiar datos  " + error);
            }
        });
        self.editableUser(createNewUserEditable());
    }

    function updatePassword() {
        self.hasError(false);
        self.errorMessages([]);
        var user = self.editablePassword();
        var id = localStorage.getItem("userId");
        var pass = self.editablePassword().password;
        var pass1 = self.editablePassword().new_password;
        var pass2 = self.editablePassword().new_password_confirmation;
        if (pass1 != pass2) {
            self.errorMessages.push("Las nuevas contraseñas no coinciden");
            self.hasError(true);
        }

        if (!pass) {
            self.errorMessages.push("Ingrese contraaseña actual");
            self.hasError(true);
        }

        if (!pass1 || !pass2) {
            self.errorMessages.push("Ingrese nueva contraseña");
            self.hasError(true);

        }

        if ((pass1.length < 7 || pass2.length < 7) && pass1 != "" && pass2 != "") {
            self.errorMessages.push("Ingrese una nueva contraseña con mínimo 7 caracteres");
            self.hasError(true);
        }
        var checkpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
        var checkPass1 = checkpass.test(pass1);
        var checkPass2 = checkpass.test(pass2);
        if ((!checkPass1 || !checkPass2) && pass1 != "" && pass2 != "") {
            self.errorMessages.push("Ingrese una nueva contraseña con al menos una letra mayúscula, un dígito y un caracter especial");
            self.hasError(true);
        }
        if (self.hasError()) {
            return;
        }

        var data = JSON.stringify(user);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "users/" + id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("Cambio de contraseña exitosa!!");
            },
            error: function (error) {
                alert("Error cambiar contraseña  " + error);
            }
        });
        self.editablePassword(createNewPasswordEditable());
    }

    function createNewUserObj(id, email, name, last_name, username, department, company_id, rol, password, password_confirmation) {
        return {
            "user": {
                "id": id,
                "email": email,
                "name": name,
                "last_name": last_name,
                "username": username,
                "department": department,
                "company_id": company_id,
                "password": password,
                "password_confirmation": password_confirmation,
                "rol": rol
            }
        };
    }
};

var usersModel;
(function () {
    var jqxhr = $.getJSON(serviceUrl + "users", function (data) {
        usersModel = new UsersModel(data);
        ko.applyBindings(usersModel);
    });
})();
