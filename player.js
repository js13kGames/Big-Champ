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
        this.pos = new V2(100, 140);
        this.angle = 0;
        this.timer = 0;
        this.hitConfirm = false;
        this.state = PlayerStateIdle;
    }

    BellyBounce()
    {
        this.pos = new V2(120, 130);
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
        DrawRect(23, 35, 20, 30, skinColor);
        DrawRect(23, 40, 20, 20, bootColor);

        // Body
        DrawCircle(0, 0, 40, skinColor, Math.PI, Math.PI*2);

        // Nipples
        DrawCircle(12, -5, 3, outlineColor);
        DrawCircle(-2, -5, 3, outlineColor);

        // Head
        DrawRect(-5, -45, 35, 35, skinColor);

        // Shoulder strap
        DrawBezierLine(-23, -29, -10, 10, -5, -10, -5, 10, outfitColor, 10);

        // Armpit shadow
        DrawCircle(-16, -4.5, 14, outlineColor);

        // Outfit bottom
        DrawCircle(0, 0, 40, outfitColor, 0, Math.PI);

        // Right leg
        DrawCircle(-10, 12, 10, skinColor);
        DrawRect(-20, 35, 20, 30, skinColor);
        DrawRect(-20, 40, 20, 20, bootColor);

        // Right arm
        DrawCircle(-17, -5, 14, skinColor);
        DrawCircle(-20, 3, 10, skinColor);

        // Eyes
        DrawRect(-3, -45, 6, 10, eyeColor);
        DrawRect(6, -45, 6, 10, eyeColor);
        DrawRect(-2, -43, 3, 5, pupilColor);
        DrawRect(7, -43, 3, 5, pupilColor);

        // Mouth
        DrawRect(0, -35, 20, 2, mouthColor);

        PopMatrix();
    }
}