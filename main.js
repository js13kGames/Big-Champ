let player = new Player();

let objs = [];
objs.push(player);

let enemyTimer;
let touchDelay;

TouchState = (reason) =>
{
    switch (reason)
    {
        case Tick:
        {
            if (touch.down)
            {
                CreateAudioContext();
                nextState = MainMenu;
            }
        } break;

        case Draw:
        {
            DrawText("Tap To Start", gameWidth*0.5, gameHeight*0.5, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 12);
        } break;
    }
}

MainMenu = (reason) =>
{
    switch (reason)
    {
        case Tick:
        {
            if (touch.down)
            {
                nextState = IntroState;
            }
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawText("Menu", gameWidth*0.5, gameHeight*0.3, 72, "#FFF", 0, "Arial", "Bold", "center", "center", 12);
        } break;
    }
}

IntroState = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            player.Reset();
            player.Intro();
        } break;

        case Tick:
        {
            objs.forEach(o => o.Tick());
            if (player.state == PlayerStateIdle)
            {
                nextState = GameState
            }
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
        } break;
    }
}

GameState = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
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
            DrawParticles();
        } break;
    }
}

let gameOverState = 0;
let gameOverTimer;
GameOver = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            clearTimeout(enemyTimer);
            gameOverState = 0;
            gameOverTimer = setInterval(() => {if (gameOverState < 10) { gameOverState++; } }, 350);
        } break;

        case Exit:
        {
            clearInterval(gameOverTimer);
        } break;

        case Tick:
        {
            if (gameOverState >= 8 && touch.down)
            {
                nextState = MainMenu;
            }

            objs.forEach(o => o.Tick());
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawParticles();
            
            if (gameOverState >= 2)
            {
                DrawText("Game Over", gameWidth*0.5, gameHeight*0.3, 72, "#DB0000", 0, "Arial", "Bold", "center", "center", 12);
            }

            if (gameOverState >= 4)
            {
                DrawText("Eliminations: " + player.score, gameWidth*0.5, gameHeight*0.4, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 8);
            }

            if (gameOverState >= 6)
            {
                let highScore = localStorage.getItem("bigchamp.highscore");
                if (highScore == null)
                {
                    highScore = 0;
                }
                DrawText("Best: " + highScore, gameWidth*0.5, gameHeight*0.48, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 8);
            }
            
            if (gameOverState >= 8)
            {
                if (player.isHighScore)
                {
                    DrawText("New Best!", gameWidth*0.5, gameHeight*0.6, 36 + Math.abs(Math.sin(Date.now()*0.005))*10.0, "#04D84E", -10, "Arial", "Bold", "center", "center", 10);
                }
            }
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
            objs.push(new Enemy_SlowRun());
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

                SpawnParticle(gameWidth*0.5, gameHeight*0.5, ParticleTypeHit);
            }
            objs[1].Animate();
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
            DrawParticles();
        } break;
    }
}

// Start initial state
nextState = TouchState;//RenderTest;//MainMenu;

// DEBUG
window.addEventListener("keydown", e =>
{
    let keyName = e.key.toLowerCase();
    if (keyName == "e")
    {
        CreateEnemy();
    }
});
