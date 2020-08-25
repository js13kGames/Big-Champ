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

    Draw()
    {
        PushMatrix(this.pos.x, this.pos.y, this.angle);

        // What follows is the DUMBEST way to draw the player...

        let skinColor = "#DC774F";
        let outlineColor = "#A3583A";
        let bootColor = "#111";
        let outfitColor = "#111";
        let eyeColor = "#FFF";
        let pupilColor = "#000";
        let mouthColor = "#500";

        // Left leg
        DrawRect(46, 70, 40, 60, skinColor);
        DrawRect(46, 80, 40, 40, bootColor);

        // Body
        DrawCircle(0, 0, 80, skinColor, Math.PI, Math.PI*2);

        // Nipples
        DrawCircle(24, -10, 6, outlineColor);
        DrawCircle(-4, -10, 6, outlineColor);

        // Head
        DrawRect(-10, -90, 70, 70, skinColor);

        // Shoulder strap
        DrawBezierLine(-46, -58, -20, 20, -10, -20, -10, 20, outfitColor, 20);

        // Armpit shadow
        DrawCircle(-32, -9, 28, outlineColor);

        // Outfit bottom
        DrawCircle(0, 0, 80, outfitColor, 0, Math.PI);

        // Right leg
        DrawCircle(-20, 24, 20, skinColor);
        DrawRect(-40, 70, 40, 60, skinColor);
        DrawRect(-40, 80, 40, 40, bootColor);

        // Right arm
        DrawCircle(-34, -10, 28, skinColor);
        DrawCircle(-40, 6, 20, skinColor);

        // Eyes
        DrawRect(-6, -90, 12, 20, eyeColor);
        DrawRect(12, -90, 12, 20, eyeColor);
        DrawRect(-4, -86, 8, 12, pupilColor);
        DrawRect(14, -86, 8, 12, pupilColor);

        // Mouth
        DrawRect(0, -70, 40, 4, mouthColor);

        PopMatrix();
    }
}