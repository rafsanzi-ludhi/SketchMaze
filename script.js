document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const resetButton = document.getElementById('resetButton');
    const gridSize = document.getElementById('gridSize');
    const gridSizeDisplay = document.getElementById('gridSizeDisplay');
    const colorPicker = document.getElementById('colorPicker');
    const bckGroundColorPicker = document.getElementById('bckGroundColorPicker'); 

    let isDrawing = false; 

    function startDrawing() {
        isDrawing = true;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    document.body.addEventListener('mousedown', startDrawing);
    document.body.addEventListener('mouseup', stopDrawing);
    document.body.addEventListener('touchstart', startDrawing);
    document.body.addEventListener('touchend', stopDrawing);

    function createGrid(size) {
        while (container.firstChild) {
            container.firstChild.remove();
        }

        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        for (let i = 0; i < size * size; i++) {
            const squares = document.createElement('div');
            squares.classList.add('squares');
            squares.style.backgroundColor = bckGroundColorPicker.value;

            squares.addEventListener('mouseover', () => {
                if (isDrawing) {
                    squares.style.backgroundColor = colorPicker.value;
                }
            });

            squares.addEventListener('touchmove', (e) => {
                if (isDrawing) {
                    // Get the element that the touch is currently over
                    const touchElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                    if (touchElement && touchElement.classList.contains('squares')) {
                        touchElement.style.backgroundColor = colorPicker.value;
                    }
                }
                e.preventDefault(); // Prevent page scrolling
            });

            squares.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });

            container.appendChild(squares);
        }
    }

    gridSize.addEventListener('input', () => {
        gridSizeDisplay.textContent = `${gridSize.value} x ${gridSize.value}`;
        let size = gridSize.value;
        createGrid(size);
    });

    bckGroundColorPicker.addEventListener('change', () => {
        const squares = document.querySelectorAll('.squares');
        squares.forEach((square) => {
            square.style.backgroundColor = bckGroundColorPicker.value;
        });
    });

    createGrid(16);

    resetButton.addEventListener('click', () => {
        let size = gridSize.value;
        createGrid(size);
    });
});
