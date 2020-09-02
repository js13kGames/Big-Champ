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

            //objs.forEach(o => o.Tick());
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawText("Menu", gameWidth*0.5, gameHeight*0.3, 72, "#FFF", 0, "Arial", "Bold", "center", "center", 12);
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
            setTimeout(CreateEnemy, 2000);
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
            clearTimeout(enemyTimer);
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
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
            DrawText("Game Over", gameWidth*0.5, gameHeight*0.3, 72, "#FFF", 0, "Arial", "Bold", "center", "center", 12);
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
            objs[1].SetAnim(EnemyAnimJump);
        } break;

        case Tick:
        {
            player.Tick();
            if (touch.down)
            {
                player.state++;
                if (player.state > PlayerStateDead)
                {
                    player.state = PlayerStateIdle;
                }
                //player.OnHit();
            }
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
CreateAudioContext();
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
