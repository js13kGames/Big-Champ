let PlayerStateIdle = 0;
let PlayerStateBelly = 1;
let PlayerStateHit = 2;
let PlayerStateDead = 3;

let BellyBounceTime = 45;
let BellyBounceAttackTime = 8;

let PlayerHitTime = 20;

class Player
{
    constructor()
    {
        this.Reset();
    }

    Reset()
    {
        this.Idle();
        this.health = 3;
        this.score = 0;
        this.bellyOffset = new V2(0, 0);
        this.bellyOffset.xLast = 0;
        this.bellyOffset.yLast = 0;
    }

    Tick()
    {
        switch (this.state)
        {
            case PlayerStateIdle:
            {
                if (touch.down && state != RenderTest)
                {
                    this.BellyBounce();
                }
            } break;

            case PlayerStateBelly:
            {
                this.timer--;
                if (this.timer == 0)
                {
                    this.Idle();
                }

                if (touch.down && this.hitConfirm)
                {
                    // re-animate belly bounce here...
                    this.BellyBounce();
                }
            } break;

            case PlayerStateHit:
            {
                this.timer--;
                if (this.timer == 0)
                {
                    if (this.health == 0)
                    {
                        this.bellyOffset.x = 10;
                        this.bellyOffset.y = 10;
                        nextState = GameOver;
                        this.state = PlayerStateDead;
                    }
                    else
                    {
                        this.Idle();
                    }
                }
            } break;

            case PlayerStateDead:
            {
            } break;
        }

        this.UpdateBellyPhysics();
    }

    Idle()
    {
        this.pos = new V2(200, 280);
        this.angle = 0;
        this.timer = 0;
        this.hitConfirm = false;
        this.state = PlayerStateIdle;
    }

    BellyBounce()
    {
        this.bellyOffset.x = 15;
        this.bellyOffset.y = 15;
        this.timer = BellyBounceTime;
        this.state = PlayerStateBelly;
    }

    IsBellyBounceAttacking()
    {
        return (this.state == PlayerStateBelly) && (this.timer >= BellyBounceTime - BellyBounceAttackTime);
    }

    OnBounce(enemy)
    {
        this.timer = 15;
        this.hitConfirm = true;
        this.score++;
    }

    OnHit(enemy)
    {
        if (this.health > 0)
        {
            this.timer = 15;
            this.health--;
            this.timer = PlayerHitTime;
            this.state = PlayerStateHit;
            this.bellyOffset.x = 5;
            this.bellyOffset.y = 5;
        }
    }

    UpdateBellyPhysics()
    {
        // Super duper simple one-pointer verlet integration

        // Simulate
        let vx = (this.bellyOffset.x - this.bellyOffset.xLast);
        let vy = (this.bellyOffset.y - this.bellyOffset.yLast);
        this.bellyOffset.xLast = this.bellyOffset.x;
        this.bellyOffset.yLast = this.bellyOffset.y;
        this.bellyOffset.x += vx;
        this.bellyOffset.y += vy;

        // Constrain
        let d = this.bellyOffset.Len();
        if (d > 0)
        {
            let restLength = 0;
            let springRatio = 0.2;
            let moveMul = (d - restLength) / d;
            let move = new V2(this.bellyOffset.x*moveMul*springRatio, this.bellyOffset.y*moveMul*springRatio);
            this.bellyOffset.SubV(move);
        }
    }

    Draw()
    {
        PushMatrix(this.pos.x, this.pos.y, this.angle);

        // What follows is the DUMBEST way to draw the player...

        this.skinColor = "#DC774F";
        this.outlineColor = "#A3583A";
        this.bootColor = "#111";
        this.outfitColor = "#111";
        this.eyeColor = "#FFF";
        this.pupilColor = "#000";
        this.mouthColor = "#500";
        this.lacesColor = "#FFF";

        switch (this.state)
        {
            case PlayerStateIdle:
            {
                this.DrawLeg(66, 24, 0);        // Left leg
                this.DrawBody(0, 0, 0);         // Body
                this.DrawHead(-10, -90, 0);     // Head
                this.DrawOutfit(0, 0, 0);       // Outfit
                this.DrawLeg(-20, 24, 0);       // Right leg
                this.DrawArm(-68, -20, 0);      // Arm
            } break;

            case PlayerStateBelly:
            {
                this.DrawLeg(90, 35, 30);       // Left leg
                this.DrawBody(40, -20, -15);    // Body
                this.DrawHead(-5, -100, -40);   // Head
                this.DrawOutfit(40, -20, -15);  // Outfit
                this.DrawLeg(25, 35, 30);       // Right leg
                this.DrawArm(-30, -22, 10);     // Arm
            } break;

            case PlayerStateHit:
            {
                this.DrawLeg(26, 14, -30);        // Left leg
                this.DrawBody(-20, 5, 0);         // Body
                this.DrawHead(-10, -80, 20);     // Head
                this.DrawOutfit(-20, 5, 0);       // Outfit
                this.DrawLeg(-50, 24, -35);       // Right leg
                this.DrawArm(-88, -15, -50);      // Arm
            } break;

            case PlayerStateDead:
            {
                this.DrawLeg(-6, 24, -60);        // Left leg
                this.DrawBody(-40, 15, 0);         // Body
                this.DrawHead(-20, -60, 40 + Math.sin(Date.now()*0.001)*5);     // Head
                this.DrawOutfit(-40, 15, 0);       // Outfit
                this.DrawLeg(-80, 42, -60);       // Right leg
                this.DrawArm(-108, -5, -20);      // Arm
            } break;
        }

        PopMatrix();
    }

    DrawLeg(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x*0.5, y + this.bellyOffset.y*0.5, angle);
        DrawCircle(-10, 8, 20, this.skinColor);     // Rounded top of leg
        DrawRect(-20, 46, 40, 60, this.skinColor);  // Leg
        DrawRect(-20, 56, 42, 42, this.bootColor);  // Boot
        DrawRect(-10, 45, 14, 4, this.lacesColor);  // Top lace
        DrawRect(-10, 55, 14, 4, this.lacesColor);  // Middle lace
        DrawRect(-10, 65, 14, 4, this.lacesColor);  // Bottom lace
        PopMatrix();
    }

    DrawBody(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x, y + this.bellyOffset.y, angle);
        DrawCircle(0, 0, 80 + this.bellyOffset.x*1, this.skinColor, Math.PI, Math.PI*2);   // Torso
        DrawCircle(24, -10, 6, this.outlineColor);  // Right nipple
        DrawCircle(-4, -10, 6, this.outlineColor);  // Left nipple
        PopMatrix();
    }

    DrawOutfit(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x, y + this.bellyOffset.y, angle);
        DrawBezierLine(-46, -58, -20, 20, -10, -20, -10, 20, this.outfitColor, 20); // Shoulder strap
        DrawCircle(-32, -9,28, this.outlineColor); // Armpit shadow
        DrawCircle(0, 0, 80 + this.bellyOffset.x*1, this.outfitColor, 0, Math.PI); // Outfit bottom
        PopMatrix();
    }

    DrawArm(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x*0.5, y + this.bellyOffset.y*0.5, angle);
        DrawCircle(0, 0, 28, this.skinColor);   // Upper
        DrawCircle(-6, 16, 20, this.skinColor); // Lower
        PopMatrix();
    }

    DrawHead(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x*0.5, y + this.bellyOffset.y*0.5, angle);

        DrawRect(0, 0, 70, 70, this.skinColor); // Head

        switch (this.state)
        {
            case PlayerStateIdle:
            {
                DrawRect(4, 0, 12, 20, this.eyeColor);   // Left eye
                DrawRect(22, 0, 12, 20, this.eyeColor);   // Right eye
                DrawRect(6, 4, 8, 12, this.pupilColor);  // Left pupil
                DrawRect(24, 4, 8, 12, this.pupilColor);  // Right pupil
                DrawRect(10, 20, 40, 4, this.mouthColor);   // Mouth
            } break;

            case PlayerStateBelly:
            {
                DrawRect(4, 0, 12, 20, this.eyeColor);   // Left eye
                DrawRect(22, 0, 12, 20, this.eyeColor);   // Right eye
                DrawRect(5, 4, 10, 12, this.pupilColor);  // Left pupil
                DrawRect(23, 4, 10, 12, this.pupilColor);  // Right pupil
                DrawRect(10, 20, 40, 10, this.mouthColor);   // Mouth
            } break;

            case PlayerStateHit:
            {
                DrawRect(4, 0, 12, 20, this.eyeColor);   // Left eye
                DrawRect(22, 0, 12, 20, this.eyeColor);   // Right eye
                DrawRect(0, 4, 10, 12, this.pupilColor);  // Left pupil
                DrawRect(28, -3, 10, 12, this.pupilColor);  // Right pupil
                DrawRect(10, 20, 40, 10, this.mouthColor);   // Mouth
            } break;

            case PlayerStateDead:
            {
                DrawRect(4, 0, 4, 20, this.pupilColor, 45);   // Left eye (x)
                DrawRect(4, 0, 4, 20, this.pupilColor, -45);   // Left eye (x)
                DrawRect(22, 0, 4, 20, this.pupilColor, 45);   // Right eye (x)
                DrawRect(22, 0, 4, 20, this.pupilColor, -45);   // Right eye (x)
                DrawRect(10, 20, 40, 10, this.mouthColor);   // Mouth
            } break;
        }

        PopMatrix();
    }
}
