let plug = new Plug();
let hub = new Hub();
let objs = [];
objs.push(plug);
objs.push(hub);

GameState = (reason) =>
{
    objs.forEach(o => o.Tick());
    objs.forEach(o => o.Draw());
}

// Start initial state
nextState = GameState;