$(document).ready(function(){
    $(".add-row").click(function(){
        var markup = "<tr><td><form><div class='form-group'><input type='text' class='form-control' class='a2'></div></form></td><td><div class='def-number-input number-input safari_only'><button class='btn btn-sm' class='minus' onclick='button()'> <i class='fa fa-minus'></i></button><input class='quantity' min='0' name='quantity' value='1' type='number'><button class='btn btn-sm' onclick='plus()' class='plus'><i class='fa fa-plus'></i></button></div></td><td> <form><div class='form-group'><input type='text' class='form-control' id='a3'></div></form></td></tr>";
        $(".tbody1").append(markup);
    });
});
