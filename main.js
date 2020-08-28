let player = new Player();

let objs = [];
objs.push(player);

let enemyTimer;
let touchDelay;

MainMenu = (reason) =>
{
    switch (reason)
    {
        case Tick:
        {
            if (touch.down)
            {
                nextState = GameState;
            }

            objs.forEach(o => o.Tick());
        } break;

        case Draw:
        {
            objs.forEach(o => o.Draw());
            DrawText("Menu", gameWidth*0.5, gameHeight*0.5, 72, "#000", 0, "Arial", "Bold", "center", "center");
        } break;
    }
}

GameState = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            player.Reset();
            enemyTimer = setInterval(() => CreateEnemy(), 1500);
        } break;

        case Tick:
        {
            objs.forEach(o => o.Tick());
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
        } break;
    }
}

GameOver = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            touchDelay = 60;
            clearInterval(enemyTimer);
        } break;

        case Tick:
        {
            touchDelay--;
            if (touchDelay < 0 && touch.down)
            {
                nextState = MainMenu;
            }

            objs.forEach(o => o.Tick());
        } break;

        case Draw:
        {
            objs.forEach(o => o.Draw());
            DrawHud();
            DrawText("Game Over", gameWidth*0.5, gameHeight*0.5, 72, "#000", 0, "Arial", "Bold", "center", "center");
        } break;
    }
}

RenderTest = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            player.Reset();
            CreateEnemy();
            objs[1].pos.x = 600;
            objs[1].pos.y = 300;
        } break;

        case Tick:
        {
            objs[1].Animate();
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
        } break;
    }
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