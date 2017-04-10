var serviceUrl= '/api/v1/';

var NewsModel = function(_news){
  var self = this;
  self.shownedNews=ko.observable(false);

  self.isVisitant=ko.observable(true);
  self.changeViewToVisitant=changeViewToVisitant;
  function changeViewToVisitant(){
    self.isVisitant(true);
  }
  self.changeViewToAdministrator=changeViewToAdministrator;
  function changeViewToAdministrator(){
    self.isVisitant(false);
  }
  self.navigationStack=ko.observableArray();
  self.news=ko.observableArray(_news).sort( function(a,b){return b.date-a.date;});
  self.editingNotice = ko.observable(createNewNotice());
  self.editingNoticeC = ko.observable(createNewNoticeObj());
  self.createNotice = createNotice;
  self.removeNew = removeNew;
  self.updateNotice= updateNotice;
  self.openNoticeToEdit=openNoticeToEdit;
  self.showNotice=showNotice;
  self.returnToNotice=returnToNotice;
  self.filterNationalNews = ko.computed(function(){
    if(!self.shownedNews()){
      return self.news();
    }
    else {
      return ko.utils.arrayFilter(self.news(), function(notice){
        return notice.location== self.shownedNews();
      });
    }
  });
  self.filter =function(location){
    self.shownedNews(location);
  };
  function createNotice(){
    var data = JSON.stringify(self.editingNoticeC());
    var token = localStorage.getItem("Token");
    $.ajax({
      headers:{"Authorization": token},
      url:serviceUrl+"news",
      type: "POST",
      data:data,
      contentType: "application/json; charset= utf-8",
      dataType:"json",
      success: function (returnedData) {
        self.news.unshift(returnedData);
        document.location.href="/regional/news";
      },
      error: function(error){
        if (error.status == 401)
            location.href="/logins";
        else
        document.location.href="/regional/news";
      }
    });
    self.editingNoticeC(createNewNoticeObj());
  }
  function updateNotice(){
    var notice= self.editingNotice();
    var token = localStorage.getItem("Token");
    var data= JSON.stringify(notice);
    $.ajax({
        headers:{"Authorization": token},
        url:serviceUrl+"news/"+ notice.id,
        type:"PUT",
        data:data,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(returnedData){
            var i = self.news.indexOf(notice);
            self.news[i] = notice;
            document.location.href="/regional/news";
        },
        error: function(error) {
           if (error.status == 401)
              location.href="/logins";
            else
              document.location.href="/regional/news";
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
          headers:{"Authorization": token},
          url: serviceUrl+"news/"+ notice.id,
          type:"DELETE",
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(returnedData){
              news.pop(notice);
              document.location.href="/regional/news";
          },
          error: function(error) {
            if (error.status == 401)
                location.href="/logins";
            else
              alert("Error eliminando noticia. " + error);
          }

      });
      self.news.remove(notice);
    }
    function returnToNotice(notice){
      do {
        var not=self.navigationStack.pop();
      }while(not!=notice);
      showNotice(notice);
    }

    function showNotice(notice){
      self.navigationStack.push(notice);
      self.editingNotice(createNewNotice());
      var jqxhr = $.getJSON(serviceUrl+"news/"+notice.id, function(data) {
          self.news(data);
      });
    }
      function createNewNoticeObj(id,title,description,full,location,date){
        return {"new": { "id" : id,
                      "title" : title,
                      "description" : description,
                      "full" : full,
                      "location" : location,
                      "date" : date
                    }};
      }

     function createNewNotice(id,title,description,full,location,date) {
       if(!id) id="";
       if(!title) title="";
       if(!description) description="";
       if(!full) full="";
       if(!location) location="";
       if(!date) date="";
       var current= self.navigationStack()[self.navigationStack().length-1];
       if(!current) newId="";
       else newId= current.id;
       newNotice = { "id" : id,
                     "title" : title,
                     "description" : description,
                     "full" : full,
                     "location" : location,
                     "date" : date
                   };
       return newNotice;
     }
};
var newsModel;
(function() {
    var jqxhr = $.getJSON(serviceUrl+"news", function(data) {
        newsModel = new NewsModel(data);
        ko.applyBindings(newsModel);
    });
})();
