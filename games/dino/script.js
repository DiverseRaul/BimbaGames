const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const message = document.getElementById('message'); // Get message element

let score = 0;
let isJumping = false;
let isGameOver = false;
let gameStarted = false; // Track if the game has started
let animationFrameId = null; // To control the animation frame loop

// --- Event Listener --- 
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('click', handleKeyPress); // Allow click/tap to start/jump/restart

function handleKeyPress(event) {
    // Allow Space, ArrowUp, or any click/tap
    const isActionKey = event.code === 'Space' || event.code === 'ArrowUp' || event.type === 'click';

    if (isActionKey) {
        if (!gameStarted) {
            startGame();
        } else if (isGameOver) {
            restartGame();
        } else if (!isJumping) {
            jump();
        }
    }
}

// --- Basic Jumping --- 
function jump() {
    if (!gameStarted || isGameOver || isJumping) return; // Don't jump if game not running or already jumping
    isJumping = true;
    dino.classList.add('jump');

    // Remove the class after the animation finishes
    setTimeout(() => {
        dino.classList.remove('jump');
        isJumping = false;
    }, 500); // Must match the CSS animation duration
}

// --- Obstacle Movement (Basic) --- 
function moveObstacle() {
    if (!gameStarted || isGameOver) return; // Stop moving if game stopped

    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));

    // Move obstacle left (increase right value)
    obstacle.style.right = (obstacleLeft + 4) + 'px'; // SLOWED DOWN: Adjust speed as needed

    // Reset obstacle when it goes off-screen
    if (obstacleLeft > 600) { // 600 is game-container width
        obstacle.style.right = '-60px'; // Reset position
        // Maybe randomize obstacle type/height here later
        increaseScore();
    }

    // Check for collision
    checkCollision();

    // Only continue loop if game is running
    if (gameStarted && !isGameOver) {
        animationFrameId = requestAnimationFrame(moveObstacle); // Store the ID
    }
}

// --- Collision Detection (Basic) ---
function checkCollision() {
    if (isGameOver || !gameStarted) return; // Exit if game over or not started

    let dinoRect = dino.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Safety Check: Don't check collision if obstacle is still mostly off-screen right
    // dinoRect.left is roughly stable, let's use that as a reference point.
    // Check if the obstacle's left edge has passed the dino's starting area.
    if (obstacleRect.left > dinoRect.right) { // If obstacle left is still to the right of dino right
        return; // Not yet close enough to collide
    }

    // Basic bounding box collision check
    if (
        obstacleRect.left < dinoRect.right &&
        obstacleRect.right > dinoRect.left &&
        obstacleRect.top < dinoRect.bottom &&
        obstacleRect.bottom > dinoRect.top
    ) {
        gameOver();
    }
}

// --- Score ---
function increaseScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
}

// --- Game Over --- 
function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(animationFrameId); // Explicitly stop the animation loop
    animationFrameId = null;

    // Display restart message
    message.textContent = `Game Over! Score: ${score}. Press Space or Click to Restart`;
    message.style.display = 'block';
    // obstacle animation/position freezing is handled by stopping moveObstacle loop
}

// --- Start Game --- 
function startGame() {
    if (gameStarted) return; // Don't restart if already started
    console.log("Bimba Run Started!");
    // Ensure previous animation frame is cancelled if somehow active
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    gameStarted = true;
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    message.style.display = 'none'; // Hide message
    obstacle.style.right = '-60px'; // Ensure obstacle starts off-screen
    dino.style.bottom = '0px'; // Ensure dino is on ground
    // Add initial obstacle movement call
    requestAnimationFrame(moveObstacle);
}

// --- Restart Game ---
function restartGame() {
    console.log("Restarting Game...");
    // Reset all state variables
    isGameOver = false;
    gameStarted = false; // Set to false, startGame will set it true
    isJumping = false;
    score = 0;

    // Reset visual elements
    scoreDisplay.textContent = `Score: ${score}`;
    dino.style.bottom = '0px';
    obstacle.style.right = '-60px'; // Start further off screen
    message.style.display = 'none';

    // Instead, just set the state to be ready for startGame
    gameStarted = false;
    isGameOver = false;
    // The next keypress/click will trigger startGame
    initializeGame(); // Reset visuals and show start message
}

// --- Initial Setup ---
function initializeGame() {
    message.textContent = 'Press Space or Click to Start';
    message.style.display = 'block';
    scoreDisplay.textContent = `Score: 0`;
    // Make sure elements are visually reset
    dino.style.bottom = '0px';
    obstacle.style.right = '-60px'; // Start further off screen
    dino.classList.remove('jump'); // Ensure jump animation isn't stuck
    // Cancel any lingering animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    // Reset state flags just in case
    isGameOver = false;
    gameStarted = false;
    isJumping = false;
}

// Initialize the game visuals on load
initializeGame();
