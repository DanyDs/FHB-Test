var serviceUrl = '/api/v1/';
var CompaniesModel = function (_companies) {
    var self = this;
    self.subsidiariesList = "";
    self.listToSave = ko.observable();
    self.isVisitantt = ko.observable(false);
    self.companyAtId = ko.observable();
    self.confirmEmail = ko.observable();
    self.confirmPassword = ko.observable();
    self.errorMessages = ko.observableArray();
    self.urlToDown = urlToDown;
    self.downCompany = downCompany;
    self.url = ko.observable("/myCompany/Downing/");
    self.openCompanyToEdit = openCompanyToEdit;
    self.navigationStack = ko.observableArray();
    self.updateCompany = updateCompany;
    self.acceptTermsAndCondtions = acceptTermsAndCondtions;
    self.showThisInfo = showThisInfo;
    self.editableCompany = ko.observable(createNewCompanyEditable());
    self.bajaRequest = ko.observable(true);
    self.acceptDown = acceptDown;
    self.rejectDown = rejectDown;
    self.downReason=ko.observable();
    self.rejectTermsAndConditions = rejectTermsAndConditions;
    self.hasError = ko.observable(false);
    self.checkbox = ko.observable(false);
    self.loguito = ko.observable();
    self.fotonit = ko.observable();
    self.companySearched = ko.observable();
    self.searchCompany = searchCompany;
    self.noBaja=noBaja;
    self.noBajaR=ko.observable(false);
    self.viewCompanyProfile=viewCompanyProfile;
    self.shownedDepartment = ko.observable();
    if (self.checkbox() === false) {
        self.hasError([]);
        self.errorMessages.push("Para poder registar su empresa debe aceptar los terminos y condiciones del sistema");
        self.hasError(true);
    }
    function showThisInfo(company) {
        self.showingCompany(company);
    }
    function searchCompany(){

    }
    function urlToDown(company) {
        document.location.href = "/companies/" + company.id;
        return self.url;
    }

    function termsAndConditions() {
        $('#viewTermsAndConditions')
            .modal({
                closable: false,
                blurring: true,
            })
            .modal('show');
    }

    function rejectTermsAndConditions() {
        self.hasError(false);
        self.errorMessages([]);
        self.checkbox(false);
        self.errorMessages.push("Para poder registar su empresa debe aceptar los terminos y condiciones del sistema");
        self.hasError(true);


        // document.getElementById("checkbox").disabled = treu;
    }

    function acceptTermsAndCondtions() {
        self.checkbox(true);
        self.hasError(false);
        self.errorMessages([]);
    }

    function openCompanyToEdit() {
        var id = localStorage.getItem("CompanyId");
        found = _companies;
        self.editableCompany(found);
        self.shownedDepartment(found.department);
        $('#editCompanyDialog')
            .modal('show');
    }
    function viewCompanyProfile(company){
      location.href = ('/supervisor/companies_profile/'+company.id);
    }
    self.companies = ko.observableArray(ko.utils.arrayMap(_companies, function (company) {
        dt = new Date();
        dt = company.created_at.split('T');
        dt = dt[0];
        return {
            id: company.id,
            name: company.name,
            email: company.email,
            rubro: company.rubro,
            detail: company.detail,
            contactName: company.contactName,
            nit: company.nit,
            address: company.address,
            telephone: company.telephone,
            status: company.status,
            department: company.department,
            nitimage: company.nitimage,
            created_at: dt,
            downed: company.downed,
            requested: company.requested,
            subsidiaries: company.subsidiaries,
            reason: company.reason,
            webpage: company.webpage,
            password: company.password,
            downed_reason: company.downed_reason,
            logo: company.logo
        };
    }));
    self.idempresa = ko.observable(0);
    self.idempresa.company = function (id) {
        return ko.computed();
    };
    self.rejected = ko.observable(false);
    self.acceptCompanyRequest = acceptCompanyRequest;
    self.rejectCompanyRequest = rejectCompanyRequest;
    self.openDetail = openDetail;
    self.termsAndConditions = termsAndConditions;
    self.showingCompany = ko.observable(ko.utils.arrayMap(_companies, function (company) {

        return {
            id: company.id,
            name: company.name,
            email: company.email,
            rubro: company.rubro,
            detail: company.detail,
            contactName: company.contactName,
            nit: company.nit,
            address: company.address,
            telephone: company.telephone,
            status: company.status,
            department: company.department,
            nitimage: company.nitimage,
            created_at: dt,
            downed: company.downed,
            requested: company.requested,
            subsidiaries: company.subsidiaries,
            reason: company.reason,
            webpage: company.webpage,
            downed_reason: company.downed_reason
        };
    }));
    self.openRequestToReject = openRequestToReject;

    self.pasarId = pasarId;
    function pasarId(company_id) {
        found = ko.utils.arrayFirst(self.companies(), function (company) {
            return company.id === company_id;
        });
        return found;
    }

    self.shownedCompany = shownedCompany;
    function shownedCompany(company) {
        found = ko.utils.arrayFirst(self.requestedCompanies, function (companyToShow) {
            return company == companyToShow;
        });
        return found;
    }

    self.downedCompany = ko.observable();
    self.editingReason = ko.observable();


    function downCompany() {
        var id = localStorage.getItem("CompanyId");
        found = _companies;
        self.editableCompany(found);
        var company = self.editableCompany();
        company.downed = true;
        company.requested=true;
        self.bajaRequest(false);
        company.downed_reason=self.downReason();
        var token = localStorage.getItem("Token");
        var data = JSON.stringify(company);
        if (!self.downReason()){
          self.noBajaR(true);
        }
          if (self.noBajaR()===true)
          {
            return;
          }
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "companies/" + company.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("La solicitud de baja de empresa ha sido enviada");
                location.href = "/companies/" + company.id;
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error aceptando solicitud. " + error);
            }
        });
    }


    self.requestedCompanies = ko.computed(function () {
        return ko.utils.arrayFilter(self.companies(), function (company) {
            return company.requested === true || company.status === false;
        });
    });
    self.requestedCompaniesCounter = ko.computed(function () {
        return ko.utils.arrayFilter(self.companies(), function (company) {
            return company.requested === true && company.status === false;
        });
    });
    self.downedCompaniesCounter = ko.computed(function () {
        return ko.utils.arrayFilter(self.companies(), function (company) {
            return company.requested === true && company.downed === true;
        });
    });
    self.categoriesSubsidiaries = ko.computed(function () {
        var sucur = self.subsidiariesList.split("||");
        var list = ko.observableArray(ko.utils.arrayMap(sucur, function (sucursal) {

            return {
                direccion: sucursal,
            };
        }));
        return list();
    });
    self.filter=function(name){
      self.companySearched(name);
    };
    self.registeredCompanies = ko.computed(function () {
      if(self.companySearched())
      {
        return ko.utils.arrayFilter(self.companies(), function (company) {
          return company.status === true && company.name.toLowerCase().startsWith(self.companySearched().toLowerCase());
            });

      }

          else
          {
            return ko.utils.arrayFilter(self.companies(), function (company) {
              return company.status === true ;

                });

          }

    });

    self.downedCompanies = ko.computed(function () {
        return ko.utils.arrayFilter(self.companies(), function (company) {
            return company.downed === true;
        });
    });
    self.editingCompany = ko.observable(createNewCompany());


    self.newSubsidiary = ko.observable(createNewSubsidiary());
    /*fuctions */
    self.noErrors = noErrors;
    self.createCompany = createCompany;
    self.createSubsidiary = createSubsidiary;
    function noErrors() {
        self.hasError(false);
        self.errorMessages("");

    }
    function noBaja(){
      if (self.downReason())
        return true;
      else
        return false;
    }
    function createSubsidiary() {
        self.subsidiariesList = self.subsidiariesList + "||" + self.newSubsidiary().direccion;
        self.updateCompany();
    }

    self.listOfErrors = ko.observableArray();
    function createCompany() {
        self.errorMessages([]);
        self.hasError(false);
        if (!self.editingCompany().company.name) {
            self.errorMessages.push("Ingrese nombre de la empresa");
            self.hasError(true);
        }
        if (!self.editingCompany().company.contactName) {
            self.errorMessages.push("Ingrese un nombre de contacto");
            self.hasError(true);
        }
        if (self.editingCompany().company.contactName) {
            if (self.editingCompany().company.contactName.split(" ").length == 1) {
                self.errorMessages.push("Ingrese un nombre de contacto con nombre y apellido");
                self.hasError(true);
            }
        }
        if (!self.editingCompany().company.email) {
            self.errorMessages.push("Ingrese un correo electronico");
            self.hasError(true);
        }
        if (self.editingCompany().company.email) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          var OK = re.test(self.editingCompany().company.email);
          if (!OK) {
              self.errorMessages.push("Ingrese un correo electrónico válido");
              self.hasError(true);
          }
        }
        var correoCreado = ko.utils.arrayFirst(self.companies(), function (company) {
            return company.email === self.editingCompany().company.email;
        });
        if (correoCreado) {
            self.errorMessages.push("Este correo ya esta siendo utilizado");
            self.hasError(true);
        }

        if (self.editingCompany().company.email != self.confirmEmail()) {
            self.errorMessages.push("Los correos no coinciden");
            self.hasError(true);
        }
        if (!self.editingCompany().company.password) {
            self.errorMessages.push("Ingrese una contraseña");
            self.hasError(true);
        }
        if (self.editingCompany().company.password) {
            if (self.editingCompany().company.password.length < 7) {
                self.errorMessages.push("Ingrese una contraseña con mínimo 7 caracteres");
                self.hasError(true);
            }
        }
        var checkpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
        var pass = checkpass.test(self.editingCompany().company.password);

        if (!pass) {
            self.errorMessages.push("Ingrese una contraseña con al menos una letra mayuscula, una letra minuscula, un digito y un caracter especial");
            self.hasError(true);
        }
        if (self.editingCompany().company.password != self.confirmPassword()) {
            self.errorMessages.push("Las contraseñas no coinciden");
            self.hasError(true);
        }
      if (isNaN(self.editingCompany().company.nit)) {
          self.errorMessages.push("Ingrese NIT de la empresa(Solo Numeros)");
            self.hasError(true);
        }
        if (!self.editingCompany().company.detail) {
            self.errorMessages.push("Ingrese detalle de la empresa");
            self.hasError(true);
        }
        if (!self.editingCompany().company.address) {
            self.errorMessages.push("Ingrese dirección de la empresa");
            self.hasError(true);
        }
        if (!self.editingCompany().company.telephone) {
            self.errorMessages.push("Ingrese teléfono de la empresa");
            self.hasError(true);
        }
        var webCreada = ko.utils.arrayFirst(self.companies(), function (company) {
            return company.webpage === self.editingCompany().company.webpage;
        });
        if (webCreada) {
            self.errorMessages.push("Esta página web ya esta siendo utilizada");
            self.hasError(true);
        }
        if (self.editingCompany().company.webpage) {
            var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/
            var OK = re.test(self.editingCompany().company.webpage);
            if (!OK) {
                self.errorMessages.push("Ingrese una página web valida");
                self.hasError(true);
            }
        }
        if (!self.editingCompany().company.department) {
            self.errorMessages.push("Seleccione departmento de la empresa");
            self.hasError(true);
        }
        if (!self.loguito()) {
            self.errorMessages.push("Suba el logotipo de la empresa");
            self.hasError(true);
        }
        if (!self.fotonit()) {
            self.errorMessages.push("Suba la fotografía del NIT de la empresa");
            self.hasError(true);
        }

        if (self.hasError())
            return;

        $("#submitRequestButton").addClass("disabled");

        self.editingCompany().subsidiaries = self.subsidiariesList;
        self.editingCompany().logoData = $("#logoPreview").attr("src");
        self.editingCompany().nitData = $("#nitPreview").attr("src");
        self.editingCompany().nitimage = $("#logoPreview").attr("src");
        self.editingCompany().logo = $("#nitPreview").attr("src");

        var data = JSON.stringify(self.editingCompany());

        $.ajax({
            url: serviceUrl + "companies",
            type: "POST",
            data: data,
            contentType: "application/json; charset= utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("Solicitud registrada satisfactoriamente. Recibirá un correo electrónico en su dirección de contacto.");
                self.companies.push(returnedData);
                document.location.href = "/";
            },
            error: function (error) {
                  if (error.status == 422)
                  {
                    // str.replace(/"([^"]+)"/g," ");
                    var str = error.responseText.split(",");
                    str.forEach(function(error) {
                      var noQuotes = error.split('"').join('');
                      noQuotes = noQuotes.split('[').join(' ');
                      noQuotes = noQuotes.split('{').join('');
                      noQuotes = noQuotes.split('{').join('');
                      noQuotes = noQuotes.split('}').join('');
                      noQuotes = noQuotes.split(']').join('');
                      var correctVariables = noQuotes.replace("name","Nombre de la empresa");
                      correctVariables = correctVariables.replace("contactName","Persona de contacto");
                      correctVariables = correctVariables.replace("Nombre de contacto inválido.","Persona de contacto: ");
                      correctVariables = correctVariables.replace("nit","Nit");
                      correctVariables = correctVariables.replace("address","Dirección de la empresa");
                      correctVariables = correctVariables.replace("telephone","Teléfono");
                      correctVariables = correctVariables.replace("password","Contraseña");
                      correctVariables = correctVariables.replace("department","Departamento");
                      correctVariables = correctVariables.replace("Nitimage","NIT");
                      correctVariables = correctVariables.replace("logo","Logo");
                      self.errorMessages.push(correctVariables);
                      self.hasError(true);
                    });

                    $("#submitRequestButton").removeClass("disabled");
                  }
                  else{
                    alert("Un error ha ocurrido al enviar su solicitud. " + error.responseText);
                    $("#submitRequestButton").removeClass("disabled");
                  }

            }
        });
    }

    function acceptCompanyRequest(company) {
        company.requested = false;
        company.status = true;
        var data = JSON.stringify(company);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "companies/" + company.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("La empresa se encuentra ahora activa");
                var i = self.companies.indexOf(company);
                self.companies[i] = company;
                document.location.href = "./requests";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error aceptando solicitud. " + error);
            }
        });
    }

    function rejectCompanyRequest() {
        var company = self.editingCompany();
        company.requested = false;
        company.status = false;
        var data = JSON.stringify(company);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "companies/" + company.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("La empresa ha sido rechazada");
                var i = self.companies.indexOf(company);
                self.companies[i] = company;
                document.location.href = "./requests";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error aceptando solicitud. " + error);
            }
        });
    }

    function openDetail(company) {
        self.showingCompany(company);
        $('#modalFull')
            .modal('show');
        return self.showingCompany;
    }

    function openRequestToReject(company) {
        self.editingCompany(company);
        $('#rejectingCompanyDialog')
            .modal('show')
        ;
    }

    function rejectDown(company) {
        company.downed = false;
        company.requested=false;
        var data = JSON.stringify(company);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "companies/" + company.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("La solicitud de baja de la empresa ha sido rechazada");
                var i = self.companies.indexOf(company);
                self.companies[i] = company;
                location.href = "/supervisor/getDowned";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error al rechazar la solicitud de baja. " + error);
            }
        });


    }

    function acceptDown(company) {
        company.downed = true;
        company.status = false;
        company.requested = false;
        var data = JSON.stringify(company);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "companies/" + company.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                alert("La empresa ha sido dada de baja");
                var i = self.companies.indexOf(company);
                self.companies[i] = company;
                location.href = "/supervisor/getDowned";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error al dar de baja. " + error);
            }
        });


    }

    function updateCompany() {
        var company = self.editableCompany();
        if ($("#logoPreview").attr("src")) {
            company.logoData = $("#logoPreview").attr("src");
        }
        var token = localStorage.getItem("Token");
        var data = JSON.stringify(company);
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "companies/" + company.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                var i = self.companies.indexOf(company);
                self.companies[i] = company;
                document.location.href = "/companies/" + company.id;
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    document.location.href = "./";
            }
        });
        self.editableCompany(createNewCompanyEditable());
    }

    function createNewCompanyEditable(id, name, email, detail, contactName, address, telephone, webpage, department, subsidiaries) {
        if (!id) id = "";
        if (!name) name = "";
        if (!email) email = "";
        if (!detail) detail = "";
        if (!contactName) contactName = "";
        if (!address) address = "";
        if (!telephone) telephone = "";
        if (!webpage) webpage = "";
        if (!department) department = "";
        var current = self.navigationStack()[self.navigationStack().length - 1];
        if (!current) newId = "";
        else newId = current.id;
        newCompany = {
            "id": id,
            "name": name,
            "contactName": contactName,
            "email": email,
            "detail": detail,
            "address": address,
            "telephone": telephone,
            "department": department,
            "webpage": webpage,
            "subsidiaries": subsidiaries
        };
        return newCompany;
    }

    function createNewCompany(id, name, email, contactName, nit, address, telephone, status, department, webpage, logo_file_name, logo_file_size, logo_content_type, nitimage, created_at, detail, downed_reason, reason, password) {
        return {
            "company": {
                "id": id,
                "name": name,
                "email": email,
                "contactName": contactName,
                "nit": nit,
                "address": address,
                "telephone": telephone,
                "status": false,
                "department": department,
                "logo_file_name": logo_file_name,
                "logo_file_size": logo_file_size,
                "logo_content_type": logo_content_type,
                "created_at": created_at,
                "detail": detail,
                "webpage": webpage,
                "requested": true,
                "downed": false,
                "reason": reason,
                "password": password,
                "downed_reason": downed_reason,
                "subsidiaries": self.subsidiariesList
            }
        };

    }

    function createNewSubsidiary(direccion) {
        return {"direccion": {"direccion": direccion}};
    }

};

var companiesModel;
(function () {
  var token = localStorage.getItem("Token");
  var query = "companies";
  if (isCompanyPage )
    if (localStorage.getItem("UserRole")=="empresa")
      query = "companies/" + localStorage.getItem("CompanyId");
    else
      query = "companies/"+companyProfileId;
  if (localStorage.getItem("UserRole")=="regional")
    query="companies/departments/"+ localStorage.getItem("userId");
  if ( newCompany)
    query = "companies/new";
    var jqxhr = $.ajax({
        headers: {"Authorization": token},
        url: serviceUrl + query,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            companiesModel = new CompaniesModel(data);
            ko.applyBindings(companiesModel);
        },
        error: function (data, status) {
            if (status == "401")
                window.location.href = "/login";
            else
                alert("Ha ocurrido un error.");
        }
    });
    })();
