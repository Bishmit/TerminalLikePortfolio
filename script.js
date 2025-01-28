const fs = {
    home: {
        projects: {
            RigidBodyPhysicsEngine: {
                name: "RigidBodyPhysicsEngine",
                githubLink: "https://github.com/Bishmit/RigidBodyPhysicsEngine",
            },
            CustomGraphTraversal: {
                name: "GraphTraversal",
                githubLink: "https://github.com/Bishmit/CustomTreeTraversal",
            },
            AStarPathFinding: {
                name: "AStarPathFinding",
                githubLink: "https://github.com/Bishmit/PathFinding-Visualization-using-Astar-algorithm",
            },
            PlaneShooter: {
                name: "PlaneShooter",
                githubLink: "https://github.com/Bishmit/Plane",
            },
            DoublePendulum: {
                name: "DoublePendulum",
                githubLink: "https://github.com/Bishmit/Double_Pendulum",
            },
            DilationErrosionSimulation: {
                name: "DilationErrosionSimulation",
                githubLink: "https://github.com/Bishmit/Dilation-method-IP-Simulation",
            },
        },
        education: {
            School: "Sunrise English School\n SEE",
            Highschool: "Gurukul College\n +2 Science(biology+math)",
            university: "Lumbini ICT Campus\n B.Sc CSIT",
        },
        achievements: "Runner up in intraschool hackathon\nParticipant Member of BOSC intercollege Hackathon\nUdemy Certification Course on python",
        
        skills: {
            Language: "C++, Python, Javascript, C#, PHP",
            FrameWork_API : "SFML, OpenGL, Raylib",
            Tools: "CMake, Git, Github, Blender",
            Database: "SQL, noSQL, mongodb",
            OS: "Window, Ubuntu, kubuntu, MacOS"
        },
    },
};

let currentDir = fs.home; 
const pathStack = ["home"]; 

const output = document.getElementById("output");
const commandInput = document.getElementById("commandInput");

function printOutput(text) {
    const atBottom = output.scrollHeight - output.scrollTop === output.clientHeight;
    output.innerHTML += text + "<br><br>"; 
    if (atBottom) {
        output.scrollTop = output.scrollHeight; 
    }
}

// Function to print the prompt
function printPrompt() {
    const currentPath = getCurrentPath();
    output.innerHTML += `<span class="prompt">bishmitregmi@bishmit:~/${currentPath}$ </span><input type="text" class="commandInput no-border"><br>`;
    const newCommandInput = document.querySelectorAll('.commandInput');
    const lastCommandInput = newCommandInput[newCommandInput.length - 1];
    lastCommandInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            handleCommand(lastCommandInput.value.trim());
            lastCommandInput.disabled = true;
        }
    });
    lastCommandInput.focus();
}


// List of available commands
const commands = {
    ls: "Lists the contents of the current directory.",
    cd: "Changes to the specified directory.",
    cat: "Displays the contents of a file.",
    clear: "Clears the terminal screen.",
    help: "Lists all available commands.",
    pwd: "Displays the current directory path.",
    whoami: "To know about me.",
};

// function to get the current path as a string
function getCurrentPath() {
    return pathStack.join("/");
}

// Handle user commands
function handleCommand(command) {
    const parts = command.split(" ");
    const cmd = parts[0];
    const arg = parts[1];

    switch (cmd) {
        case "ls":
            if (typeof currentDir === "object") {
                printOutput(Object.keys(currentDir).join("<br>"));
            } else {
                printOutput("**Cannot list contents of a file.**");
            }
            break;

        case "cd":
            if (arg === "/") {
                currentDir = fs.home;
                pathStack.length = 1; // Reset pathStack to root
                printOutput(`**Changed directory to ${getCurrentPath()}**`);
            } else if (arg === "..") {
                if (pathStack.length > 1) {
                    pathStack.pop();
                    currentDir = pathStack.reduce((acc, key) => acc[key], fs);
                    printOutput(`**Returned to parent directory: ${getCurrentPath()}**`);
                } else {
                    printOutput("**Already at the root directory.**");
                }
            } else if (arg && currentDir[arg]) {
                if (typeof currentDir[arg] === "object") {
                    currentDir = currentDir[arg];
                    pathStack.push(arg);
                    printOutput(`**Changed directory to ${getCurrentPath()}**`);
                } else {
                    printOutput(`**${arg} is not a directory.**`);
                }
            } else {
                printOutput(`**No such directory: ${arg}**`);
            }
            break;

        case "cat":
            if (arg && currentDir[arg]) {
                if (typeof currentDir[arg] === "object") {
                    if (currentDir === fs.home.projects) {
                        const project = currentDir[arg];
                        printOutput(`Project Name: ${project.name}<br>GitHub Link: <a href="${project.githubLink}" target="_blank">${project.githubLink}</a>`);
                    } else {
                        printOutput(`**${arg} is a directory.**`);
                    }
                } else {
                    printOutput(currentDir[arg]);
                }
            } else {
                printOutput(`**No such file: ${arg}**`);
            }
            break;

        case "clear":
            output.innerHTML = ""; // Clear the terminal output
            break;

        case "help":
            printOutput("Available commands:");
            for (let cmd in commands) {
                printOutput(`${cmd}: ${commands[cmd]}`);
            }
            break;

        case "pwd":
            printOutput(getCurrentPath());
            break;

        case "whoami":
            printOutput(`Hello there. I am Bishmit Regmi, a C++ coder/learner who loves C++ and low-level development.
            I am passionate about coding and learning how things work. I am pursuing my bachelor's degree in computer science and information technology at Lumbini ICT Campus.
            I have a deep interest in learning game programming, making simulations, and also towards AI. I have quite good experience with C++ and want to excel in this field.
            In my free time, I enjoy coding by making simulations, simple games, competitive programming, or just coding anything that is interesting. I also watch anime.`);
            break;

        default:
            printOutput("**Command not found.**");
            break;
    }

    printPrompt(); // Print the prompt after the command is executed
}

// Initialize the first prompt
printPrompt();
