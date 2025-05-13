var $sidebarAndWrapper = $("#ham,#left-menu");

$("#ham").click(function () {
  $sidebarAndWrapper.toggleClass("hide-sidebar");
});
// $("#dentbtn").click(function () {
//   $("#textbox").show();
// });

$("#childadd").hide();
$("#parentadd").click(function () {
  $("#childadd").show();
});


function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#img-upload-tag').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}
$("#img-upload").change(function () {
  readURL(this);
});
