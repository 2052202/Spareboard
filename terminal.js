  const output = document.getElementById('output');
  const input = document.getElementById('cmd-input');

  // Define terminal apps that interact with the DOM


  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = input.value.trim();
      if (!raw) return;

      // Print user command
      output.innerHTML += `<div>&gt; ${raw}</div>`;
      
      // Parse command and arguments
      const [cmd, ...args] = raw.split(" ");
      if (commands[cmd]) {
        const result = commands[cmd](args);
        if (result) output.innerHTML += `<div>${result}</div>`;
      } else {
        output.innerHTML += `<div>Command not found: ${cmd}</div>`;
      }

      input.value = "";
      document.getElementById('console-window').scrollTop = output.scrollHeight;
    }
  });