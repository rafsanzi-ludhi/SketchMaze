document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const resetButton = document.getElementById('resetButton');
    const gridSize = document.getElementById('gridSize');
    const gridSizeDisplay = document.getElementById('gridSizeDisplay');
    const colorPicker = document.getElementById('colorPicker');
    const bckGroundColorPicker = document.getElementById('bckGroundColorPicker'); // Get color picker

    let mouseDown = false; // Track the state of the mouse button
    document.body.onmousedown = () => (mouseDown = true)
    document.body.onmouseup = () => (mouseDown = false)

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
            squares.style.backgroundColor = bckGroundColorPicker.value; // Set the background color of the div element

            // Add event listener to change the color of the square when the mouse is over it
            squares.addEventListener('mouseover', () => {
                if (mouseDown) { // Add the color only if the mouse is being pressed
                    squares.style.backgroundColor = colorPicker.value;
                }
            });

            // Prevent dragging of the squares when trying to draw that causes it to lag
            squares.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });

            // Add the div element to the container
            container.appendChild(squares);
        }
    }

    // Update the display whenever the slider value changes
    gridSize.addEventListener('input', () => {
        gridSizeDisplay.textContent = `${gridSize.value} x ${gridSize.value}`;
        let size = gridSize.value;
        createGrid(size);
    });

    // Change the background color of all squares when the color picker value changes
    bckGroundColorPicker.addEventListener('change', () => {
        const squares = document.querySelectorAll('.squares');
        squares.forEach((square) => {
            square.style.backgroundColor = bckGroundColorPicker.value;
        });
    });

    // Initialize the grid with 16x16 squares
    createGrid(16);

    // When the reset button is clicked, recreate the grid with the slider value
    resetButton.addEventListener('click', () => {
        let size = gridSize.value;
        createGrid(size);
    });
});

