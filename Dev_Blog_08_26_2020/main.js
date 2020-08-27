let player = new Player();

let objs = [];
objs.push(player);

let enemyTimer;
let touchDelay;

MainMenu = (reason) =>
{
    if (touch.down)
    {
        nextState = GameState;
    }

    objs.forEach(o => o.Tick());
    objs.forEach(o => o.Draw());

    DrawText("Menu", gameWidth*0.5, gameHeight*0.5, 72, "#000", 0, "Arial", "Bold", "center", "center");
}

GameState = (reason) =>
{
    if (reason == Enter)
    {
        player.Reset();
        //enemyTimer = setInterval(() => CreateEnemy(), 1500);
    }

    DrawBackground();

    objs.forEach(o => o.Tick());
    objs.forEach(o => o.Draw());

    DrawHud();
}

GameOver = (reason) =>
{
    if (reason == Enter)
    {
        touchDelay = 60;
        clearInterval(enemyTimer);
    }

    touchDelay--;
    if (touchDelay < 0 && touch.down)
    {
        nextState = MainMenu;
    }

    objs.forEach(o => o.Tick());
    objs.forEach(o => o.Draw());

    DrawHud();

    DrawText("Game Over", gameWidth*0.5, gameHeight*0.5, 72, "#000", 0, "Arial", "Bold", "center", "center");
}

// UI
DrawHud = (reason) =>
{
    for (let i = 0; i < 3; ++i)
    {
        DrawRect(40 + (40*i), 40, 20, 20, player.health > i ? "#F00" : "#444");
    }

    DrawText(player.score.toString(), gameWidth - 40, 50, 40, "#000", 0, "Arial", "Bold", "right", "center");
}

// Start initial state
nextState = GameState;//MainMenu;

// DEBUG
window.addEventListener("keydown", e =>
{
    let keyName = e.key.toLowerCase();
    if (keyName == "e")
    {
        CreateEnemy();
    }
});