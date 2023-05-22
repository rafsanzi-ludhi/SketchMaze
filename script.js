document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const resetButton = document.getElementById('resetButton');
    const gridSize = document.getElementById('gridSize');
    const gridSizeDisplay = document.getElementById('gridSizeDisplay');
    const colorPicker = document.getElementById('colorPicker');



    function createGrid(size) {
        // Remove existing squares
        while (container.firstChild) {
            container.firstChild.remove();
        }

        // Update the CSS grid
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        // Create new squares
        for (let i = 0; i < size * size; i++) {
            const squares = document.createElement('div'); // Create a div element
            squares.classList.add('squares'); // Add the squares class to the div element

            squares.addEventListener('mouseover', () => {
                squares.classList.add('black');
            });

            container.appendChild(squares);
        }
    }

    // Update the display whenever the slider value changes
    gridSize.addEventListener('input', () => {
        gridSizeDisplay.textContent = `${gridSize.value} x ${gridSize.value}`;
    });


    // Initialize the grid with 16x16 squares
    createGrid(16);

    // When the reset button is clicked, recreate the grid with the slider value
    resetButton.addEventListener('click', () => {
        let size = gridSize.value;
        createGrid(size);
    });
});
