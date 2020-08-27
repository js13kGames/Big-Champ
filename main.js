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
        enemyTimer = setInterval(() => CreateEnemy(), 1500);
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

RenderTest = (reason) =>
{
    if (reason == Enter)
    {
        player.Reset();
        CreateEnemy();
        objs[1].pos.x = 600;
        objs[1].pos.y = 300;
    }

    DrawBackground();

    objs.forEach(o => o.Draw());
    objs[1].Animate();

    DrawHud();
}

// Start initial state
nextState = GameState;//RenderTest;//MainMenu;

// DEBUG
window.addEventListener("keydown", e =>
{
    let keyName = e.key.toLowerCase();
    if (keyName == "e")
    {
        CreateEnemy();
    }
});