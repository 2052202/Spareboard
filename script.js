let escURL;
let fileURL;
if (localStorage.getItem("escURL") != null) {
  escURL = localStorage.getItem("escURL");
} else if (localStorage.getItem("escURL") == null) {
  escURL = "https://www.clever.com";
  localStorage.setItem("escURL", escURL);
}
if (localStorage.getItem("pageTitle") != null) {
  document.title = localStorage.getItem("pageTitle")
} else if (localStorage.getItem("pageTitle") == null) {
  document.title = "CLI";
}

function parseFlags(args) {
    let flags = [];
    for (let i = 0; i < args.length; i++){
        if (args[i][0] == '-') {
            flags.push(args[i]);
        }
    }
    return flags;
  }
  
  const commands = {
    // Util
    help: (args) => {
      return `<pre>
Available Commands: 
help: shows the help screen 
bgcolor [color]: changes the background color [default: deep charcoal] 
color [color]: changes the font color [default: lime] 
title [title]: changes the web page name [default: CLI] 
clear: clears the console
escape [flag?] [url]: changes the webpage to the url [default: clever]
  > The -d flag changes the default URL instead of redirecting 
  > Note: after redirecting, the favicon will change to the site you redirected to.
esc: shorthand for esc, changes the webpage to the default URL
add [addend] [addend]: adds two numbers
freq [URL]: sends a fetch request to the URL
execute [Code]: returns the answer (execute 1 + 1: ouput 2)
load: loads a file [popup]
launch [file name]: launches another program (learn more at: launch help)
terminate: terminates the launch
       </pre>
      `;
    },
    bgcolor: (args) => {
      document.body.style.backgroundColor = args[0] || "#111";
      document.getElementById('console-window').style.backgroundColor = args[0] || "#111"; 
      return `Changed page background to ${args[0] || "deep charcoal."}`;
    },
    color: (args) => {
        document.getElementById("console-window").style.color = args[0] || "#0f0";
        input.style.color = args[0] || "#0f0";
        return `Changed text color to ${args[0] || "lime."}`;
    },
    title: (args) => {
      const newTitle = args.join(" ") || "CLI";
      document.title = newTitle;
      localStorage.setItem("pageTitle", newTitle);
      return `Updated page title to "${newTitle}"`;
    },
    clear: (args) => {
      output.innerHTML = "";
      return null;
    },
    escape: (args) => {
      if (args[0] == '-d') {
        try {
          escURL = new URL(args[1]);
          
        } catch (error) {
          escURL = "https://www.clever.com";
          return `An error has occured (format your url correctly); new default URl: ${escURL}`;
        }
        localStorage.setItem("escURL",escURL.toString());
        return `The default escape URL has been changed to ${escURL}`
      } else {
        window.location.replace(args[0] || escURL);
      }
    },
    esc: (args) => {
      window.replace(escURL)
    },
    // Functional
    debug: (args) => {
        return parseFlags(args);
    },
    add(args){
        return Number(args[0]) + Number(args[1]);
    },
    async freq(args) {
      let URL = args[0]; 
      try {
        let response = await fetch(args[0]);
        if (!response.ok) {
          return "Invalid URL or client-side issue. Could also be a network or locally blocked site.";
        }
        const data = await response.text();
        return data;
      } catch (error) {
        console.error(error)
      }
    }, 
    execute(args) {
      const string = args.join(" ") || "hello";
      let ans = eval(string);
      if (ans == null || "") {
        return "not a valid statement"
      } else {
        return ans;
      }
    }, 
    async load(args) {
      const fileUpload = document.getElementById("fileInput");

      const result = await new Promise(resolve => {
        fileUpload.onchange = () => resolve(fileUpload.files[0] ?? null);
        fileUpload.oncancel = () => resolve(null);

        fileUpload.click();
      });
      if (result != null) {
        fileURL = URL.createObjectURL(result);
        return "Loaded: " + result.name;
      }
      return "Failed to load"
    },
    terminate() {
      document.querySelector("iframe").style.display = "none";
      document.getElementById("backKey").style.display = "none";
    }, 
    launch(args) {
      document.getElementById("backKey").style.display = "flex";
      const iFrame = document.getElementById("screenFrame");
      iFrame.style.width = "100%";
      iFrame.style.height = "100vh";
      iFrame.style.display = "block";
      if (URL.canParse(args[0])) {
        iFrame.src = args[0];
      } else if (args[0] == "gm-toolkit") {
       iFrame.src = "./CLI/gm-toolkit.html";
      } else if (args[0] == "emulator" || args[0] == "pokemon" || args[0] == "emulatorButton") {
        iFrame.src = "./offline.html"
      } else if (args[0] == "help") {
        this.terminate();
        return `<pre> pokemon || emulator || emulatorButton: emulator that supports GBA
gm-toolkit: a toolkit for utitility in games 
url: goes to that url (not unblocked)</pre>`
      }
      iFrame.requestFullscreen();
      return null;
    },
    disguise(args) {
      window.open("./loader.html")
      window.location.replace(args[0]);
    }
  };