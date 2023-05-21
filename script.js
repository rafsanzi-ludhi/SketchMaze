document.addEventListener('DOMContentLoaded', () => { // When the DOM is loaded
    const container = document.querySelector('.container'); // Select the container
    const resetButton = document.getElementById('resetButton');
    const gridSize = document.getElementById('gridSize');

    for (let i = 0; i < 256; i++) { // Create 256 divs with the class 'squares'
        const squares = document.createElement('div'); // Create a div
        squares.classList.add('squares'); // Add the class 'squares' to the div

        // Add mouseover event listener to each box
        squares.addEventListener('mouseover', () => {
            // add a class to the div for black color
            squares.classList.add('black');
        });


        container.appendChild(squares); // Append the div to the container
    }
});
