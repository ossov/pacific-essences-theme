document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('.header__menu-item');
  menuItems.forEach(function(item) {
    item.style.whiteSpace = 'nowrap';
  });
});