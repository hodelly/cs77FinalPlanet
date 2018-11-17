$('input:radio[name="radius"]').change(function () {
    $('input:radio[name="radius"]:checked').parent().removeClass("q1label unselected").addClass("selected");
    $('input:radio[name="radius"]').not(':checked').parent().removeClass("q1label selected").addClass("unselected");
  
  });