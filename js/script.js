let fs;
let currentDir;
const pathStack = ["home"];

async function loadFSData() {
    const response = await fetch('../json/data.json'); 
    fs = await response.json();
    currentDir = fs.home;
    initializeTerminal();
}

function initializeTerminal() {
    const output = document.getElementById("output");
    const commandInput = document.getElementById("commandInput");

    function printOutput(text) {
        const atBottom = output.scrollHeight - output.scrollTop === output.clientHeight;
        output.innerHTML += text + "<br><br>"; 
        if (atBottom) {
            output.scrollTop = output.scrollHeight; 
        }
    }

    // to print the prompt
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

    const commands = [
        "ls", "cd", "cat", "clear", "pwd", "whoami", "neofetch"
    ];
    
    
    //get the current path as a string
    function getCurrentPath() {
        return pathStack.join("/");
    }

    // handle user commands
    function handleCommand(command) {
        const parts = command.split(" ");
        const cmd = parts[0];
        const arg = parts[1];

        const projectNames = Object.keys(fs.home.projects); 
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
                        pathStack.length = 1; // reset pathStack to root
                    } else if (arg === "..") {
                        if (pathStack.length > 1) {
                            pathStack.pop();
                            currentDir = pathStack.reduce((acc, key) => acc[key], fs);
                            printOutput(`**Returned to parent directory: ${getCurrentPath()}**`);
                        } else {
                            printOutput("**Already at the root directory.**");
                        }
                    } else if (arg && currentDir[arg]) {
                        if (projectNames.includes(arg)) {
                            printOutput(`**${arg} is not a directory.**`);
                        } else if (typeof currentDir[arg] === "object") {
                            currentDir = currentDir[arg];
                            pathStack.push(arg);
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
                            printOutput(`Project Name: ${project.name}<br>GitHub Link: <a id="gitproj" href="${project.githubLink}" target="_blank">${project.githubLink}</a>`);
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
                output.innerHTML = ""; 
                break;

            case "help":
                for (let cmd in commands) {
                    printOutput(`${commands[cmd]}`);
                }
                break;

            case "pwd":
                printOutput(getCurrentPath());
                break;

            case "whoami":
                printOutput(`Hello there. I am Bishmit Regmi, Dedicated and passionate C++ learner with interest in developing high-performance algorithms, interactive simulations, graphics programming and Game development. Proficient in modern C++ standards(C++11/14/17/20), physics simulations, and recreational programming. I am keen to pursue a career in software development and related technical roles.`);
                break;
            
            case "neofetch":
              const asci = displayNeofetch(); 
              printOutput(asci); 
            break; 

            default:
                printOutput("**Command not found.**");
                break;
        }

        printPrompt();
    }

    printPrompt();
}

loadFSData();