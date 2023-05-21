document.addEventListener('DOMContentLoaded', () => { // When the DOM is loaded
    const container = document.querySelector('.container'); // Select the container

    for (let i = 0; i < 256; i++) { // Create 256 divs with the class 'box'
        const squares = document.createElement('div'); // Create a div
        squares.classList.add('squares'); // Add the class 'squares' to the div
        container.appendChild(squares); // Append the div to the container
    }
});
