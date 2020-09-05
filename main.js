let player = new Player();

let objs = [];
objs.push(player);

let TouchState = (reason) =>
{
    switch (reason)
    {
        case Tick:
        {
            if (touch.down)
            {
                tkNextState = MainMenu;
            }
        } break;

        case Draw:
        {
            DrawText("Tap", gameWidth*0.5, gameHeight*0.5, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 12);
        } break;
    }
}

let MainMenu = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            isFrenzy = false;
            setTimeout(() => {zzfx(...[,0,587,,,.28,3,.07,,,,,,,,.1,,.62,.1]);}, 0);
            setTimeout(() => {zzfx(...[,0,587,,,.28,3,.07,,,,,,,,.1,,.62,.1]);}, 250);
            setTimeout(() => {zzfx(...[,0,587,,,.28,3,.07,,,,,,,,.1,,.62,.1]);}, 500);
        } break;

        case Tick:
        {
            if (touch.down)
            {
                tkNextState = IntroState;
            }
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            let bounceIdx = Date.now() % 400;
            let color = "#FF6A00";
            if (bounceIdx < 75)
            {
                color = "#FFD800";
            }
            else if (bounceIdx < 150)
            {
                color = "#FFA000";
            }
            let size = 90 + Math.abs(Math.sin((bounceIdx / 400)*Math.PI))*1.5;
            DrawText("Big Champ", gameWidth*0.5, gameHeight*0.3, size, "#FFF", 0, "Arial", "Bold", "center", "center", 20, color);
            DrawText("Big Champ", gameWidth*0.5, gameHeight*0.3, size, "#FFF", 0, "Arial", "Bold", "center", "center", 12, "#000");
            DrawText("Weighing in at 404 lbs!", gameWidth*0.5, gameHeight*0.45, 32, "#FFF", 0, "Arial", "Bold", "center", "center", 9, "#000");
            if (Date.now()%800 < 600)
            {
                DrawText("- Tap To Start -", gameWidth*0.5, gameHeight*0.85, 32, "#FFD800", 0, "Arial", "Bold", "center", "center", 9);
            }
        } break;
    }
}

let IntroState = (reason) =>
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
                tkNextState = GameState
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

let GameState = (reason) =>
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
let GameOver = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            clearTimeout(enemyTimer);
            gameOverState = 0;
            gameOverTimer = setInterval(() =>
            {
                if (gameOverState < 10)
                {
                    gameOverState++;
                    if (gameOverState == 2 || gameOverState == 4 || gameOverState == 6)
                    {
                        zzfx(...[,,1983,,,.06,,.53,-68,,,,,,9,.2]); // Blip 664
                    }
                    else if (gameOverState == 8 && player.isHighScore)
                    {
                        zzfx(...[,,703,.02,.03,.19,,.92,-8,,,,,,,.1,,.63,.07]); // Jump 813
                        setTimeout(() => {zzfx(...[,,703,.02,.03,.19,,.92,-8,,,,,,,.1,,.63,.07]);}, 200);
                        setTimeout(() => {zzfx(...[,,703,.02,.03,.19,,.92,-8,,,,,,,.1,,.63,.07]);}, 400);
                        setTimeout(() => {zzfx(...[,,511,.31,.1,1.75,4,2.74,.6,.6,,,,.7,,.2,,.75,.09]);}, 600);
                    }
                }
            }, 250);
        } break;

        case Exit:
        {
            clearInterval(gameOverTimer);
        } break;

        case Tick:
        {
            if (gameOverState >= 8 && touch.down)
            {
                tkNextState = MainMenu;
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
                DrawText("Eliminations: " + player.score, gameWidth*0.5, gameHeight*0.42, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 8);
            }

            if (gameOverState >= 6)
            {
                let highScore = localStorage.getItem("bigchamp.highscore");
                if (highScore == null)
                {
                    highScore = 0;
                }
                DrawText("Best: " + highScore, gameWidth*0.5, gameHeight*0.52, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 8);
            }
            
            if (gameOverState >= 8)
            {
                if (player.isHighScore)
                {
                    DrawText("New Best!", gameWidth*0.5, gameHeight*0.63, 36 + Math.abs(Math.sin(Date.now()*0.005))*10.0, "#04D84E", -10, "Arial", "Bold", "center", "center", 10);
                }
            }
        } break;
    }
}

let RenderTest = (reason) =>
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
tkNextState = TouchState;//RenderTest;//MainMenu;
