let plug = new Plug();
let hub = new Hub();
let objs = [];
objs.push(hub);
objs.push(plug);

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
        plug.Reset();
    }
});