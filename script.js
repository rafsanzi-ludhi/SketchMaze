// Selecting important elements from the HTML document, using their 'id' values, so they can be manipulated later.
const container = document.getElementById("grid-container");
const gridSizeSlider = document.getElementById("gridSize");
const gridSizeValue = document.getElementById("gridSizeValue");
const gridSizeValue2 = document.getElementById("gridSizeValue2");
const resetButton = document.getElementById("resetButton");
const penColorPicker = document.getElementById("penColor");
const backgroundColorPicker = document.getElementById("backgroundColor");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");

// Setting initial state and default values.
let isMousePressed = false; // Checks if the mouse is being pressed or not.
let currentPenColor = '#000000'; // Default drawing colour (black)
let drawingSession = false; // Tracks if user is currently drawing.

// Create a grid for drawing. The size of the grid (number of cells in a row or column) is determined by the parameter n.
function createGrid(n) {
    container.innerHTML = ''; // Remove any previously generated grid (and it's contents), instead it's set to an empty string.
    container.style.gridTemplateColumns = `repeat(${n}, 1fr)`; // Set grid columns,  it's specifying that there should be n columns of equal width (1fr each).

    // Initialization (let i = 0): 
    // Before the loop starts, a new variable i is created and initialized with the value 0. It helps track how many times the loop has run.
    // Condition (i < n * n):
    // This part checks whether the loop should continue running. In this case, the loop will keep running as long as the value of i is less than the result of n * n. 
    // Increment (i++):
    // After each run of the loop, the value of i is increased by 1. The i++ syntax is shorthand for i = i + 1. 
    // This increment ensures that the loop won't run indefinitely; i will eventually reach or exceed n * n, causing the loop to stop.
    for (let i = 0; i < n * n; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell"); //For each iteration of the loop, a new div element is created, representing an individual cell. 
        
        // Event to handle starting a drawing.
        cell.addEventListener('mousedown', function(event) {
            isMousePressed = true; // Mouse button is being held down.
            event.target.style.backgroundColor = currentPenColor; // The background colour of the cell is set to the current drawing colour.
            event.target.setAttribute('painted', true); // An attribute 'painted' is added to cells, marking them as drawn.
            drawingSession = true;  // Indicate that a drawing session has started.
        });
        
        // Event to handle drawing continuation.
        cell.addEventListener('mouseover', function(event) {
            if (isMousePressed) {
                event.target.style.backgroundColor = currentPenColor;
                event.target.setAttribute('painted', true);
            }
        });

        // Event to handle starting a drawing for touch devices
        cell.addEventListener('touchstart', function(event) {
        event.preventDefault(); // prevent scroll or other default actions
        isMousePressed = true;
        event.target.style.backgroundColor = currentPenColor;
        event.target.setAttribute('painted', true);
        drawingSession = true;
        });
    
        // Event to handle drawing continuation for touch devices
        cell.addEventListener('touchmove', function(event) {
        event.preventDefault(); // prevent scroll or other default actions
        let touch = event.touches[0]; 
        let target = document.elementFromPoint(touch.clientX, touch.clientY); 
        if (isMousePressed && target && target.classList.contains('grid-cell')) {
            target.style.backgroundColor = currentPenColor;
            target.setAttribute('painted', true);
        }
         });

        container.appendChild(cell); // Add cell to the grid.
    }
}

// For undo and redo functionality.
let history = []; // An empty array named 'history'. To keep track of drawn states (think of this array as a stack of photos).
let historyIndex = -1; // A variable named ' historyIndex'. To navigate through drawn states/photos.
// Starting at -1 is a common convention when there's an empty array and you want to indicate that no valid item has been accessed or that the array is in its initial state. 
// Once the first drawing state is added to the history, it will increment this index to 0, pointing to the first item.

// Saves the current state of the grid (colours of each cell) in the history array.
// Think of a function as a reusable set of instructions
function saveStateToHistory() {
    const currentState = [...container.children].map(cell => ({
// container.children: This gets all the child elements (i.e., the cells) of the container.
// [...container.children]: The three dots here represent the spread operator. It takes the children of the container and spreads them out into a new array (using a live collection causes problems).
// .map(cell => {...}): The map method is used to create a new array by applying a function to each item in the existing array. 
// In this case, it transforms each child (each cell of the grid) into a new object.
        color: cell.style.backgroundColor,
        painted: cell.hasAttribute('painted')
    // ^ currentState will be an array where each item is an object representing a cell of the grid with its color and whether it's painted or not.
    }));

    history = history.slice(0, historyIndex + 1);
// slice(0, historyIndex + 1): The slice method is used to get a portion of the history array. It starts at index 0 and goes up to (but doesn't include) historyIndex + 1.
// By reassigning this sliced array to history, it remove all states after the current historyIndex. 
// This is essential after an undo operation because if a user draws again after undoing,"future" states are discarded and a new branch of history is started.

    history.push(currentState); // Adds the currentState array (which we built at the start of the function) to the end of the history array. The push method is used to add one or more items to the end of an array.
    historyIndex++; // Here, we increment the historyIndex by 1. This means that the current state we just saved is now the "latest" in our history, and historyIndex points to it.
}

// Load a saved state from history array.
function loadStateFromHistory() {
    const savedState = history[historyIndex];
// history: An array that stores snapshots of different stages of your drawing. Every snapshot captures the color of each cell on your canvas at a particular moment.
// historyIndex: A number indicating which snapshot (or state) in our history array we want to access (think of it as a bookmark in your list of saved drawings).
// savedState: This variable now holds the particular snapshot (a list of cell colors and their states) we want to load onto our canvas.

// container: This represents the main drawing area or canvas where all the individual drawing cells (or small squares) are placed.
// childNodes: These are all the individual drawing cells/squares inside the canvas.
// forEach: This is a way to say, "for each individual cell in our canvas, perform the following actions".
    container.childNodes.forEach((cell, index) => {
        cell.style.backgroundColor = savedState[index].color;
    // ^ Takes each cell (small square) from the canvas and sets its background color. The color we're using is the one from our saved snapshot. We use the index to make sure each cell gets its corresponding color from the snapshot.


        if (savedState[index].painted) { // savedState[index].painted: This checks if the current cell (in our snapshot) has a property that indicates it was painted.
            cell.setAttribute('painted', true); // cell.setAttribute('painted', true): If the cell was painted, we add an attribute named 'painted' to it. (Think of it as a label - a way to remember that this particular cell was painted).
        } else { 
            cell.removeAttribute('painted'); // cell.removeAttribute('painted'): If the cell was not painted in the snapshot, we make sure to remove any 'painted' label/attribute from it on the canvas.
        }
    });
}

// Event to handle grid size change with the slider.
// addEventListener('input', function() {...}: Whenever the slider's value changes (input event), the enclosed function is executed.
gridSizeSlider.addEventListener('input', function() { 
    gridSizeValue.textContent = this.value; // this.value: Refers to the current value of the slider.
    gridSizeValue2.textContent = this.value; // gridSizeValue.textContent = this.value;: Displays the current slider value in an element on the page.
    createGrid(this.value); // createGrid(this.value);: Calls the createGrid function, adjusting the grid to match the current slider value.
    saveStateToHistory(); // saveStateToHistory();: Saves the current state of the grid to history for possible future "Undo" actions.
});

// Event to handle grid and colour reset.
resetButton.addEventListener('click', function() {
    gridSizeSlider.value = 16;
    gridSizeValue.textContent = 16;
    gridSizeValue2.textContent = 16;
    createGrid(16);
    penColorPicker.value = '#000000';
    backgroundColorPicker.value = '#ffffff'; 
    currentPenColor = '#000000';
    saveStateToHistory();
});

// Event to update drawing colour.
penColorPicker.addEventListener('input', function() {
    currentPenColor = this.value;
});

// Event to update grid background colour.

backgroundColorPicker.addEventListener('input', function() { // 'input' - every time the user changes the value in the backgroundColorPicker, the provided function will be executed.
    let cells = document.querySelectorAll('.grid-cell'); //  This line fetches all elements with the class name grid-cell from the document. The resulting list of elements is stored in the cells variable.
// Iterates over each cell in the grid.
    cells.forEach(cell => {
        if (!cell.hasAttribute('painted')) { // Checks if the cell hasn't been painted on (!cell.hasAttribute('painted')).
            cell.style.backgroundColor = this.value; // If unpainted, it changes the cell's background color to the picked color.
        }
    });
    saveStateToHistory(); // Saves this new state to history.
});

// Undo functionality.
undoButton.addEventListener('click', function() {
    if (historyIndex > 0) { // Checks if historyIndex is greater than 0. This is to make sure that there are previous states available in the history to revert to. If historyIndex were 0, it would mean that the user is at the oldest state in the history, and there's nothing to "undo".
        historyIndex--; // If there's a state to revert to, the historyIndex is decremented. This action moves the index one step back in the history.
        loadStateFromHistory(); // the function loadStateFromHistory() is called to reload the drawing grid to the state that corresponds to the current historyIndex.
    }
});

// Redo functionality.
redoButton.addEventListener('click', function() {
    if (historyIndex < history.length - 1) { // Check's if historyIndex is less than the last index of the history array. This is to verify that there's a subsequent state available to "redo" to. If the historyIndex were equal to the last index, it would imply the user is already at the most recent state, and there's nothing to "redo".
        historyIndex++; // historyIndex++;: If a subsequent state is available, the historyIndex is incremented. This moves the index one step forward in the history.
        loadStateFromHistory();
    }
});

// Events to handle end of drawing session.
document.addEventListener('mouseup', function() { // Mouse button is released
    isMousePressed = false;
    if (drawingSession) { // This conditional checks whether a drawing session was active
        drawingSession = false; // Drawing session is done
        saveStateToHistory();
    }
});

document.addEventListener('mouseleave', function() { // Triggered when mouse pointer leaves grid-container
    isMousePressed = false;
    if (drawingSession) {
        drawingSession = false;
        saveStateToHistory();
    }
});

// Prevent unwanted drag behavior.
document.addEventListener('dragstart', function(event) { 
    event.preventDefault(); // This method stops the browser's default behavior for the 'dragstart' event - useful if the drawing grid includes elements that are draggable by default (the code ensures that the drawing experience remains uninterrupted and consistent).
});

// Events to handle end of drawing session for touch devices.
document.addEventListener('touchend', function() {
    isMousePressed = false;
    if (drawingSession) {
        drawingSession = false;
        saveStateToHistory();
    }
});

// Create initial grid and save its state.
createGrid(16);
saveStateToHistory(); 