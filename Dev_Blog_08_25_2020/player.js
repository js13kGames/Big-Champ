let PlayerStateIdle = 0;
let PlayerStateBelly = 1;

let BellyBounceTime = 45;
let BellyBounceAttackTime = 8;

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
    }

    Tick()
    {
        switch (this.state)
        {
            case PlayerStateIdle:
            {
                if (touch.down)
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
        }
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
        this.pos = new V2(240, 260);
        this.angle = -15;
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
        this.timer = 15;
        this.health--;
        if (this.health == 0)
        {
            nextState = GameOver;
        }
    }

    DrawLeg(x, y, angle)
    {
        PushMatrix(x, y, angle);
        DrawCircle(-10, 8, 20, this.skinColor);
        DrawRect(-20, 46, 40, 60, this.skinColor);
        DrawRect(-20, 56, 42, 42, this.bootColor);
        DrawRect(-10, 45, 14, 4, this.lacesColor);
        DrawRect(-10, 55, 14, 4, this.lacesColor);
        DrawRect(-10, 65, 14, 4, this.lacesColor);
        PopMatrix();
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

        // Left leg
        this.DrawLeg(66, 24, 0);
        //DrawRect(46, 70, 40, 60, this.skinColor);
        //DrawRect(46, 80, 40, 40, this.bootColor);

        // Body
        DrawCircle(0, 0, 80, this.skinColor, Math.PI, Math.PI*2);

        // Nipples
        DrawCircle(24, -10, 6, this.outlineColor);
        DrawCircle(-4, -10, 6, this.outlineColor);

        // Head
        DrawRect(-10, -90, 70, 70, this.skinColor);

        // Shoulder strap
        DrawBezierLine(-46, -58, -20, 20, -10, -20, -10, 20, this.outfitColor, 20);

        // Armpit shadow
        DrawCircle(-32, -9, 28, this.outlineColor);

        // Outfit bottom
        DrawCircle(0, 0, 80, this.outfitColor, 0, Math.PI);

        // Right leg
        this.DrawLeg(-20, 24, 0);
        // DrawCircle(-20, 24, 20, this.skinColor);
        // DrawRect(-40, 70, 40, 60, this.skinColor);
        // DrawRect(-40, 80, 40, 40, this.bootColor);

        // Right arm
        DrawCircle(-34, -10, 28, this.skinColor);
        DrawCircle(-40, 6, 20, this.skinColor);

        // Eyes
        DrawRect(-6, -90, 12, 20, this.eyeColor);
        DrawRect(12, -90, 12, 20, this.eyeColor);
        DrawRect(-4, -86, 8, 12, this.pupilColor);
        DrawRect(14, -86, 8, 12, this.pupilColor);

        // Mouth
        DrawRect(0, -70, 40, 4, this.mouthColor);

        PopMatrix();
    }
}