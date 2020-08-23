let player = new Player();

let objs = [];
objs.push(player);
objs.push(new Enemy());

GameState = (reason) =>
{
    objs.forEach(o => o.Tick());
    objs.forEach(o => o.Draw());
}

// Start initial state
nextState = GameState;

// DEBUG
window.addEventListener("keydown", e =>
{
    let keyName = e.key.toLowerCase();
    if (keyName == "r")
    {
        //plug.Reset();
    }
});