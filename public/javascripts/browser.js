var bootstrap = require("./bootstrap"),
  $ = require("jquery"),
  contentTemplate = require("./views/content.jade");

function loadContent($el){
  var dfr = new $.Deferred();
  $el.empty();
  setTimeout(function(){
    $el.append(contentTemplate());
    dfr.resolve();
  }, 3000);
  return dfr.promise();
}

$(document).ready(function(){
  window.$ = $;

  $("body").on("show.bs.tab", 'a[data-toggle="tab"], a[data-toggle="pill"]', function(){
    var $this = $(this);
    var $tabPane = $($this.attr("href"));
    if ($tabPane.is(".dynamic")) {
      $tabPane.addClass("loading");
      loadContent($tabPane.find(".dynamic-content").addBack(".dynamic-content").first()).then(function(){
        $tabPane.removeClass("loading");
      });

    }
  });
});