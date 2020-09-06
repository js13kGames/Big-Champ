let player = new Player();

let objs = [];
objs.push(player);

// Create a song
let song = [[[,0,130.81,,2,,,,,,,,,,,,,0.7,0.05],[2,0,261.62,,2,,1,,,,,,0.2,,,,0.01,0.8,0.1],[4,0,523.25,,2,,1,,,,,,0.2,,,,0.01,0.5,0.01],[,0,261.62,0.1,1,0.5,,,,,,,,1,,,,0.5,0.1],[1,0,65.4,0.02,1,,,0.1,,,,,0.2,,,,,0.4,0.05],[,0,65.4,0.05,0.3,0.4,2,0.4,,,,,,0.2,,0.06,,0.7,0.05],[3,0,65.4,,1,,1,2,,,,,0.2,,,0.1,0.2,0.2,0.1,0.8],[,0,84,,,0.1,,0.7,,,,0.5,,6.7,1,0.05],[,0,2200,,,0.04,3,2,,,800,0.02,,4.8,,0.01,0.1],[0.8,0,2100,,,0.3,3,3,,,-400,,,2],[,0,360,,,0.12,2,2,,,,,,9,,0.1],[3,0,130.81,,0.5,0.5,,2,,,,,0.01,,,,0.2,0.5,0.1,0.4],[,,1046.5,,,0.05,,27,13,,,0.3],[,0,60,0.05,,0.06,3,0.7,2,-24,,,,,,,0.01],[,0,1046.5,,0.01,,1,,,,523.25,0.03,,,,0.09,0.1],[,0,261.62,0.01,1,,,,-32,,,,0.2,,,0.2,0.01,,,1]],[[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,16,20,-1,16,-1,20,-1,16,-1,20,-1,21,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,-1,0,0,16,16,16,-1,16,-1,0,0,0,0],[10,0,35,0,0,0,0,0,35,35,35,0,0,0,35,0,35,0]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,19,-1,21,19,21,19,-1,23,22,21,16,-1,16,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,22,0,0,,21,0,0,0,19,0,0,21,16,-1,16,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,16,20,-1,16,-1,20,-1,16,-1,20,-1,21,-1],[10,0,35,0,0,0,0,0,35,35,35,0,0,0,35,0,35,0]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,19,-1,21,19,21,19,-1,23,22,21,16,-1,16,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,-1,0,0,16,16,16,-1,16,-1,0,0,0,0],[10,0,35,0,0,0,0,0,35,35,35,0,0,0,35,0,35,0]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,-1,0,0,16,16,16,-1,16,-1,0,0,0,0]]],[0,0,1,1,1,1,2,2,3,2,4,2,2,3,2,4,5,5,5,5,6,7,6,7,1,1,1,1,5,4,4,8],125];
let mySongData = zzfxM(...song);
let myAudioNode = undefined;
let musicOn = true;
let sfxOn = true;

let TouchState = (reason) =>
{
    switch (reason)
    {
        case Tick:
        {
            if (touch.down)
            {
                myAudioNode = zzfxP(...mySongData);
                myAudioNode.loop = true;
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
                if (touch.x >= actualWidth*0.78 && touch.y >= actualHeight*0.80)
                {
                    let oldSfxOn = sfxOn;
                    sfxOn = true;
                    zzfx(...[,,523,.01,,.07,3,.11,46,10,,,,,,.1,.03,.32,.01]); // Blip 11
                    sfxOn = oldSfxOn;

                    if (sfxOn && musicOn)
                    {
                        sfxOn = false;
                        musicOn = false;
                        myAudioNode.stop();
                    }
                    else if (!sfxOn && !musicOn)
                    {
                        sfxOn = true;
                        musicOn = false;
                    }
                    else if (sfxOn)
                    {
                        sfxOn = false;
                        musicOn = true;
                        myAudioNode = zzfxP(...mySongData); myAudioNode.loop = true;
                    }
                    else
                    {
                        sfxOn = true;
                        musicOn = true;
                    }
                }
                else
                {
                    tkNextState = IntroState;
                }
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

            let sfxDisplay = "SFX: " + (sfxOn ? "Yes" : "No");
            DrawText(sfxDisplay, gameWidth - 20, gameHeight*0.9, 24, "#FFF", 0, "Arial", "Bold", "right", "center", 7);
            let musicDisplay = "MUSIC: " + (musicOn ? "Yes" : "No");
            DrawText(musicDisplay, gameWidth - 20, gameHeight*0.97, 24, "#FFF", 0, "Arial", "Bold", "right", "center", 7);

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
