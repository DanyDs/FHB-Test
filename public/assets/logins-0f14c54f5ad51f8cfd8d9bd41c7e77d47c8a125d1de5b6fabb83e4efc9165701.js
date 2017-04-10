var serviceUrl = '/api/v1/';

var LoginsModel = function () {
    var self = this;

    // Properties
    self.errorMessage = ko.observable();
    self.editingLoginModel = ko.observable(createNewLoginObj());

    //Functions
    self.signIn = signIn;

    function signIn() {
        if (!self.editingLoginModel().email) {
            self.errorMessage("Ingrese un usuario");
            return;
        }

        var data = JSON.stringify(self.editingLoginModel());

        $.ajax({
            url: serviceUrl + "logins",
            type: "POST",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                window.localStorage.setItem("Token", returnedData.token);
                window.localStorage.setItem("UserRole", returnedData.role);
                window.localStorage.setItem("UserName", returnedData.user_name);
                window.localStorage.setItem("CompanyId", returnedData.company_id);
                window.localStorage.setItem("CompanyName", returnedData.company_name);

                if (returnedData.role == "general") {
                    location.href = ("/users");
                } else {
                    if (returnedData.role == "regional") {
                        location.href = ("/companies");
                    } else {
                        location.href = ("/companies/"+returnedData.company_id);
                    }
                }
            },
            error: function (error) {
                self.errorMessage("Usuario o contraseña incorrectos, intente de nuevo");
            }
        });

        self.editingLoginModel(createNewLoginObj());
    };

    function createNewLoginObj(email, password) {
        return { "email": email, "password": password };
    }
};

var loginsModel;

(function () {
    loginsModel = new LoginsModel();
    ko.applyBindings(loginsModel);
})();
