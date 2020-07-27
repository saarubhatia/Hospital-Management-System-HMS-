$(document).ready(function(){
    $(".add-row").click(function(){
        var markup = "<tr><th scope='row'></th><td><form><div class='form-group'><input type='text' class='form-control'class='a2'></div></form></td></tr>";
        $(".tbody1").append(markup);
    });
});