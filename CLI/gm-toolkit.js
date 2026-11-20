const commands = {
    help (args) {
        return `<pre> 
        random [d#] [d#]...: returns a random number like a dx die.
        </pre>`
    },
    random(args) {
        if (!args || args.length === 0) {
        return "Please input at least one argument.";
        }
        let ans = [];
        for (let i = 0; i < args.length; i++) {
        const max = Number(args[i]);
        // Valid Check
        if (!isNaN(max) && max >= 1) {
            const roll = Math.floor(Math.random() * Math.floor(max)) + 1;
            ans.push(roll);
        }
        }
        if (ans.length === 0) {
        return "Please provide valid numbers greater than 0.";
        }

        return ans.join(" ");
    }
};
