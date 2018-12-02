var $navList = $('.nav-list');

$navList.on('click', 'li:not(.selected)', function(e){
  $navList.find(".selected").removeClass("selected");
  $(e.currentTarget).addClass("selected");
});

function openModal() {
  document.getElementById('loginModal').style.display='block';
}