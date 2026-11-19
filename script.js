let escURL;
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
launch [type] [file]: launches another program
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
      window.location.replace(escURL);
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
      const string = args.join(" ") || "return 'hello'";
      return eval(string);
    }, 
    async load(args) {
      const fileUpload = document.getElementById("fileInput");

      const result = await new Promise(resolve => {
        fileUpload.onchange = () => resolve(fileUpload.files[0] ?? null);
        fileUpload.oncancel = () => resolve(null);

        fileUpload.click();
      });
      return "Loaded: " + result.name;
    },
    launch(args) {
      
    }
  };