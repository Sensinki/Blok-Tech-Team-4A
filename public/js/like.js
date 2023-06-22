/* eslint-disable indent */
// Select all checkboxes with the class "heart-checkbox"
const checkboxes = document.querySelectorAll(".heart-checkbox");

// Select the container for the liked items
const listLiked = document.querySelector(".listLiked");

// Select the container for all items
const list = document.querySelector(".list");

// Iterate over each checkbox
checkboxes.forEach((checkbox) => {
    // Add change event listener to each checkbox
    checkbox.addEventListener("change", function () {
        if (this.checked) {
            // If the checkbox is checked, move it and its label to the list of liked items
            const label = this.nextElementSibling;
            listLiked.appendChild(this);
            listLiked.appendChild(label);
        } else {
            // If the checkbox is unchecked, move it and its label back to the original list
            const label = this.nextElementSibling;
            const index = Array.from(listLiked.children).indexOf(label);
            if (index !== -1) {
                // Remove the checkbox and label from the list of liked items
                listLiked.removeChild(label);
                listLiked.removeChild(this);
                // Insert the checkbox and label back to their original positions in the list
                list.insertBefore(this, list.children[index]);
                list.insertBefore(label, list.children[index]);
            }
        }
    });
});
