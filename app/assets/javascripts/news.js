var serviceUrl = '/api/v1/';

var NewsModel = function (_news) {
    var self = this;
    self.shownedNews = ko.observable(false);

    self.isVisitant = ko.observable(true);
    self.changeViewToVisitant = changeViewToVisitant;
    function changeViewToVisitant() {
        self.isVisitant(true);
    }

    self.changeViewToAdministrator = changeViewToAdministrator;
    function changeViewToAdministrator() {
        self.isVisitant(false);
    }

    self.navigationStack = ko.observableArray();
    self.news = ko.observableArray(_news).sort(function (a, b) {
        return b.date - a.date;
    });
    self.editingNotice = ko.observable(createNewNotice());
    self.editingNoticeC = ko.observable(createNewNoticeObj());
    self.createNotice = createNotice;
    self.removeNew = removeNew;
    self.updateNotice = updateNotice;
    self.openNoticeToEdit = openNoticeToEdit;
    self.showNotice = showNotice;
    self.returnToNotice = returnToNotice;
    self.errorMessages = ko.observableArray();
    self.hasError = ko.observable(false);
    self.noErrors = noErrors;
    self.noticeImage = ko.observable();
    self.filterNationalNews = ko.computed(function () {
        if (!self.shownedNews()) {
            return self.news();
        }
        else {
            return ko.utils.arrayFilter(self.news(), function (notice) {
                return notice.location == self.shownedNews();
            });
        }
    });
    self.filter = function (location) {
        self.shownedNews(location);
    };
    function noErrors() {
        self.hasError(false);
        self.errorMessages("");

    }

    function createNotice() {
        self.errorMessages([]);
        self.hasError(false);
        if (!self.editingNoticeC().new.date) {
            self.errorMessages.push("Ingrese fecha de la noticia");
            self.hasError(true);
        }
        if (!self.editingNoticeC().new.title) {
            self.errorMessages.push("Ingrese título de la noticia");
            self.hasError(true);
        }
        if (!self.editingNoticeC().new.description) {
            self.errorMessages.push("Ingrese el detalle de la noticia");
            self.hasError(true);
        }
        if (self.editingNoticeC().new.link) {
            var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
            var regex = /^\s*$/;
            var OK = re.test(self.editingNoticeC().new.link);
            var OKs = regex.test(self.editingNoticeC().new.link);
            if (!OK && !OKs) {
                self.errorMessages.push("Ingrese una página web válida. Por ejemplo: 'http://www.ejemplo.com' ");
                self.hasError(true);
            }
        }

        if (self.hasError())
            return;
        if ($("#imagePreview").attr("src")) {
            self.editingNoticeC().new.hasImage = true;
        }
        else {
            self.editingNoticeC().new.hasImage = false;
        }
        self.editingNoticeC().imageData = $("#imagePreview").attr("src");
        var data = JSON.stringify(self.editingNoticeC());
        var token = localStorage.getItem("Token");

        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "news",
            type: "POST",
            data: data,
            contentType: "application/json; charset= utf-8",
            dataType: "json",
            success: function (returnedData) {
                self.news.unshift(returnedData);
                document.location.href = "/admin/news";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    document.location.href = "/admin/news";
            }
        });
        self.editingNoticeC(createNewNoticeObj());
    }

    function updateNotice() {
        var notice = self.editingNotice();
        if ($("#imagePreview").attr("src")) {
            notice.imageData = $("#imagePreview").attr("src");
            notice.hasImage = true;
        }
        else {
            notice.hasImage = false;
        }
        var token = localStorage.getItem("Token");
        var data = JSON.stringify(notice);
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "news/" + notice.id,
            type: "PUT",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                var i = self.news.indexOf(notice);
                self.news[i] = notice;
                document.location.href = "/admin/news";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    document.location.href = "/admin/news";
            }
        });
        self.editingNotice(createNewNotice());
    }

    function openNoticeToEdit(notice) {
        self.editingNotice(notice);
        $('#editNoticeDialog')
            .modal('show')
        ;
    }

    function removeNew(notice) {
        var data = JSON.stringify(notice);
        var token = localStorage.getItem("Token");
        $.ajax({
            headers: {"Authorization": token},
            url: serviceUrl + "news/" + notice.id,
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnedData) {
                news.pop(notice);
                document.location.href = "/admin/news";
            },
            error: function (error) {
                if (error.status == 401)
                    location.href = "/logins";
                else
                    alert("Error eliminando noticia. " + error);
            }

        });
        self.news.remove(notice);
    }

    function returnToNotice(notice) {
        do {
            var not = self.navigationStack.pop();
        } while (not != notice);
        showNotice(notice);
    }

    function showNotice(notice) {
        self.navigationStack.push(notice);
        self.editingNotice(createNewNotice());
        var jqxhr = $.getJSON(serviceUrl + "news/" + notice.id, function (data) {
            self.news(data);
        });
    }

    function formatDateYMD(date) {
        var dateString = date.getFullYear() + "-";
        if (date.getMonth()+1 < 10)
            dateString += "0";

        dateString += (date.getMonth()+1) + "-";

        if (date.getDate() < 10)
            dateString += "0";
        dateString += date.getDate();

        return dateString;
    }

    function createNewNoticeObj(id, title, description, full, location, date, link, hasImage) {
        return {
            "new": {
                "id": id,
                "title": title,
                "description": description,
                "full": full,
                "location": location,
                "date": formatDateYMD(new Date()),
                "link": link,
                "hasImage": hasImage
            }
        };
    }

    function createNewNotice(id, title, description, full, location, date) {
        if (!id) id = "";
        if (!title) title = "";
        if (!description) description = "";
        if (!full) full = "";
        if (!location) location = "";
        if (!date) date = "";
        var current = self.navigationStack()[self.navigationStack().length - 1];
        if (!current) newId = "";
        else newId = current.id;
        newNotice = {
            "id": id,
            "title": title,
            "description": description,
            "full": full,
            "location": location,
            "date": date
        };
        return newNotice;
    }
};
var newsModel;
(function () {

    ko.bindingHandlers.lineBreaks = {
        init: function (element, valueAccessor, allBindings, data, context) {
            var value = valueAccessor();
            $(element).html(value.replace(/\n/g, '<br />'));
        }
    };

    var jqxhr = $.getJSON(serviceUrl + "news", function (data) {
        newsModel = new NewsModel(data);
        ko.applyBindings(newsModel);
    });
})();
