```html\n' +
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Pac-Man Game</title>\n' +
    '    <style>\n' +
    '        .game-board {\n' +
    '            width: 560px;\n' +
    '            height: 560px;\n' +
    '            border: 2px solid black;\n' +
    '            display: flex;\n' +
    '            flex-wrap: wrap;\n' +
    '            background-color: black;\n' +
    '        }\n' +
    '\n' +
    '        .grid-cell {\n' +
    '            width: 20px;\n' +
    '            height: 20px;\n' +
    '            border: 1px solid black;\n' +
    '        }\n' +
    '\n' +
    '        .pac-dot {\n' +
    '            background-color: #fff;\n' +
    '            border: 8px solid black;\n' +
    '            box-sizing: border-box;\n' +
    '        }\n' +
    '\n' +
    '        .wall {\n' +
    '            background-color: blue;\n' +
    '        }\n' +
    '\n' +
    '        .power-pellet {\n' +
    '            background-color: green;\n' +
    '            border-radius: 10px;\n' +
    '        }\n' +
    '\n' +
    '        .pacman {\n' +
    '            background-color: yellow;\n' +
    '            border-radius: 10px;\n' +
    '        }\n' +
    '\n' +
    '        .ghost {\n' +
    '            background-color: red;\n' +
    '            border-radius: 10px;\n' +
    '        }\n' +
    '\n' +
    '        .score {\n' +
    '            font-family: Arial, sans-serif;\n' +
    '            font-size: 20px;\n' +
    '            margin-bottom: 10px;\n' +
    '        }\n' +
    '    </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '    <div class="score">Score: <span id="score">0</span></div>\n' +
    '    <div class="game-board" id="game-board"></div>\n' +
    '\n' +
    '    <script>\n' +
    "        const gameBoard = document.getElementById('game-board');\n" +
    "        const scoreDisplay = document.getElementById('score');\n" +
    '        const width = 28;\n' +
    '        const height = 28;\n' +
    '        let score = 0;\n' +
    '        let pacmanPosition = 490; // Starting position\n' +
    '\n' +
    '        // Create game board layout\n' +
    '        const layout = [];\n' +
    '        for (let i = 0; i < width * height; i++) {\n' +
    "            const cell = document.createElement('div');\n" +
    "            cell.classList.add('grid-cell');\n" +
    '            \n' +
    '            // Add walls around the edges\n' +
    '            if (i < width || i >= width * (height - 1) || i % width === 0 || i % width === width - 1) {\n' +
    "                cell.classList.add('wall');\n" +
    '            } else {\n' +
    "                cell.classList.add('pac-dot');\n" +
    '            }\n' +
    '            \n' +
    '            gameBoard.appendChild(cell);\n' +
    '            layout.push(cell);\n' +
    '        }\n' +
    '\n' +
    '        // Place Pac-Man\n' +
    "        layout[pacmanPosition].classList.add('pacman');\n" +
    "        layout[pacmanPosition].classList.remove('pac-dot');\n" +
    '\n' +
    '        // Movement control\n' +
    "        document.addEventListener('keydown', movePacman);\n" +
    '\n' +
    '        function movePacman(e) {\n' +
    "            layout[pacmanPosition].classList.remove('pacman');\n" +
    '            \n' +
    '            switch(e.keyCode) {\n' +
    '                case 37: // Left\n' +
    "                    if (pacmanPosition % width !== 0 && !layout[pacmanPosition - 1].classList.contains('wall'))\n" +
    '                        pacmanPosition -= 1;\n' +
    '                    break;\n' +
    '                case 38: // Up\n' +
    "                    if (pacmanPosition - width >= 0 && !layout[pacmanPosition - width].classList.contains('wall'))\n" +
    '                        pacmanPosition -= width;\n' +
    '                    break;\n' +
    '                case 39: // Right\n' +
    "                    if (pacmanPosition % width < width - 1 && !layout[pacmanPosition + 1].classList.contains('wall'))\n" +
    '                        pacmanPosition += 1;\n' +
    '                    break;\n' +
    '                case 40: // Down\n' +
    "                    if (pacmanPosition + width < width * height && !layout[pacmanPosition + width].classList.contains('wall'))\n" +
    '                        pacmanPosition += width;\n' +
    '                    break;\n' +
    '            }\n' +
    '\n' +
    '            // Eat pac-dot\n' +
    "            if (layout[pacmanPosition].classList.contains('pac-dot')) {\n" +
    "                layout[pacmanPosition].classList.remove('pac-dot');\n" +
    '                score += 10;\n' +
    '                scoreDisplay.textContent = score;\n' +
    '            }\n' +
    '\n' +
    "            layout[pacmanPosition].classList.add('pacman');\n" +
    '        }\n' +
    '    </script>\n' +
    '</body>\n' +
    '</html>\n' +
    '```\n'