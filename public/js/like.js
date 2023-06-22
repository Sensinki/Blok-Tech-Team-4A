const checkboxes = document.querySelectorAll('.heart-checkbox');
const listLiked = document.querySelector('.listLiked');
const list = document.querySelector('.list');

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      const label = this.nextElementSibling;
      listLiked.appendChild(this);
      listLiked.appendChild(label);
    } else {
      const label = this.nextElementSibling;
      const index = Array.from(listLiked.children).indexOf(label);
      if (index !== -1) {
        listLiked.removeChild(label);
        listLiked.removeChild(this);
        list.insertBefore(this, list.children[index]);
        list.insertBefore(label, list.children[index]);
      }
    }
  });
});