const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;  // Size of each cell in the maze
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

// Maze array to hold current maze
let maze = Array.from({ length: rows }, () => Array(cols).fill('#'));

function initializeMaze() {
    maze = Array.from({ length: rows }, () => Array(cols).fill('#'));
    // Start and end positions
    maze[1][1] = 'S'; // Start
    maze[rows - 2][cols - 2] = 'E'; // End
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === '#') {
                ctx.fillStyle = '#000';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }

    // Draw 'Start' and 'End' labels
    ctx.fillStyle = '#00f'; // Blue for labels
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 'S') {
                ctx.fillText('Start', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
            } else if (maze[y][x] === 'E') {
                ctx.fillText('End', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
            }
        }
    }
}

function generateMaze() {
    initializeMaze();

    function carvePath(x, y) {
        const directions = [
            [0, -2], [0, 2], [2, 0], [-2, 0] // Up, Down, Right, Left
        ].sort(() => Math.random() - 0.5); // Shuffle directions

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const mx = x + dx / 2;
            const my = y + dy / 2;

            if (nx >= 1 && nx < cols - 1 && ny >= 1 && ny < rows - 1 && maze[ny][nx] === '#') {
                maze[ny][nx] = ' ';
                maze[mx][my] = ' ';
                carvePath(nx, ny);
            }
        }
    }

    carvePath(1, 1); // Start carving from the start position
    drawMaze();
}

function solveMaze() {
    const stack = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path = [];
    
    // Find the start and end positions
    let startX, startY, endX, endY;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 'S') {
                startX = x;
                startY = y;
            } else if (maze[y][x] === 'E') {
                endX = x;
                endY = y;
            }
        }
    }

    stack.push([startX, startY]);
    visited[startY][startX] = true;

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Right, Down, Left, Up

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        path.push([x, y]);

        if (x === endX && y === endY) {
            path.push([x, y]); // End position
            break;
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === ' ' && !visited[ny][nx]) {
                visited[ny][nx] = true;
                stack.push([nx, ny]);
            }
        }
    }

    return path;
}

function drawSolution(path) {
    ctx.strokeStyle = '#f00'; // Red color for the solution path
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (const [x, y] of path) {
        ctx.lineTo(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    }
    ctx.stroke();
}

document.getElementById('generateButton').addEventListener('click', generateMaze);
document.getElementById('solveButton').addEventListener('click', () => {
    const path = solveMaze();
    drawMaze(); // Redraw maze to ensure it's visible
    drawSolution(path); // Draw the solution path in red
});

// Initial maze generation
generateMaze();
