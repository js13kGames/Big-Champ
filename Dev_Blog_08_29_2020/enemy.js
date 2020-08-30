let EnemyStateMoveToPlayer = 0;
let EnemyStateBounceOff = 1;

let EnemyStyleLowerShorts = 0;
let EnemyStyleLowerPants = 1;

let EnemyStyleHeadNormal = 0;

let EnemyFrameIdle = 0;
let EnemyFrameRun01 = 1;
let EnemyFrameRun02 = 2;
let EnemyFrameRun03 = 3;
let EnemyFrameBounceOff = 4;

let EnemyAnimIdle = { frames: [EnemyFrameIdle], counts: [1] };
let EnemyAnimRun = { frames: [EnemyFrameRun01, EnemyFrameRun02, EnemyFrameRun03, EnemyFrameRun02], counts: [9, 9, 9, 9] };
let EnemyAnimBounceOff = { frames: [EnemyFrameBounceOff], counts: [1] };

class Enemy
{
    constructor()
    {
        this.pos = new V2(840, 310);
        this.vel = new V2(0, 0);
        this.state = EnemyStateMoveToPlayer;
        this.angle = 0;
        this.color = "000";
        this.bounceThreshold = player.pos.x + 80;
        this.damageThreshold = player.pos.x + 10;
        this.bounceOffAngleAdj = 0;

        // Rendering vars
        this.styleLower = EnemyStyleLowerShorts;
        this.styleHead = EnemyStyleHeadNormal;
        this.frame = EnemyFrameBounceOff;
        this.skinColor = "#DC774F";
        this.outlineColor = "#A3583A";
        this.outfitColor = "#B00";
        this.bootColor = "#B00";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";

        // Animation
        this.SetAnim(EnemyAnimRun);
    }

    Tick()
    {
        switch(this.state)
        {
            case EnemyStateMoveToPlayer:
            {
                this.MoveToPlayer();

                if (this.pos.x <= this.bounceThreshold && player.IsBellyBounceAttacking())
                {
                    this.BounceOff();
                }
                else if (this.pos.x <= this.damageThreshold && !player.IsBellyBounceAttacking())
                {
                    player.OnHit(this);
                    this.KillSelf();
                }
            } break;

            case EnemyStateBounceOff:
            {
                this.pos.AddV(this.vel);
                this.vel.y += 0.8;
                this.angle += this.bounceOffAngleAdj;

                if (this.pos.y > gameHeight)
                {
                    this.KillSelf();
                }
            } break;
        }

        this.Animate();
    }

    Animate()
    {
        this.curAnimFrameCount++;
        if (this.curAnimFrameCount >= this.anim.counts[this.curAnimFrame])
        {
            this.curAnimFrameCount = 0;
            this.curAnimFrame++;
            if (this.curAnimFrame >= this.anim.frames.length)
            {
                this.curAnimFrame = 0;
            }
        }

        this.frame = this.anim.frames[this.curAnimFrame];
    }

    SetAnim(anim)
    {
        this.anim = anim;
        this.curAnimFrameCount = 0;
        this.curAnimFrame = 0;
    }

    MoveToPlayer()
    {
        this.pos.AddV(this.vel);
    }

    BounceOff()
    {
        this.vel.Set(7 + Math.random()*5.0, -11 - Math.random()*4.0);
        this.bounceOffAngleAdj = 4 + Math.random()*5;
        if (Math.random() < 0.4)
        {
            this.vel.x = -this.vel.x;
            this.vel.y *= 1.5;
            this.bounceOffAngleAdj = -this.bounceOffAngleAdj;
        }
        this.state = EnemyStateBounceOff;
        this.SetAnim(EnemyAnimBounceOff);
        
        player.OnBounce(this);
    }

    KillSelf()
    {
        // Todo make global
        let idx = objs.indexOf(this);
        if (idx > -1)
        {
            objs.splice(idx, 1);
        }

        //CreateEnemy();
    }

    Draw()
    {
        PushMatrix(this.pos.x, this.pos.y, this.angle);
        switch (this.frame)
        {
            case EnemyFrameIdle:
            {
                this.DrawLeg(-23, 43, 0);   // Right leg
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(27, 43, 0);    // Left leg
                this.DrawArm(20, -15, 0);      // Arm
            } break;

            case EnemyFrameRun01:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 43, 20);   // Right leg
                this.DrawArm(-30, -25, -55);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, -40);    // Left leg
                this.DrawArm(20, -25, 55);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameRun02:
            {
                PushMatrix(0, -15, -5);
                this.DrawLeg(-23, 43, 0);   // Right leg
                this.DrawArm(-30, -25, 0);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, 0);    // Left leg
                this.DrawArm(20, -25, 0);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameRun03:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 43, -20);   // Right leg
                this.DrawArm(-30, -25, 55);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, 40);    // Left leg
                this.DrawArm(20, -25, -55);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameBounceOff:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 43, 70);   // Right leg
                this.DrawArm(-30, -25, 120);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, -70);    // Left leg
                this.DrawArm(20, -25, -120);      // Arm
                PopMatrix();
            } break;
        }
        PopMatrix();

        // DEBUG
        //DrawLine(this.bounceThreshold, 0, this.bounceThreshold, gameHeight, "#0F0");
        //DrawLine(this.damageThreshold, 0, this.damageThreshold, gameHeight, "#F00");
    }

    DrawBody(x, y, angle)
    {
        PushMatrix(x, y, angle);
        DrawRect(-5, 0, 60, 80, this.skinColor);   // Torso
        PopMatrix();
    }

    DrawOutfit(x, y, angle)
    {
        PushMatrix(x, y, angle);
        switch(this.styleLower)
        {
            case EnemyStyleLowerShorts:
            case EnemyStyleLowerPants:
            {
                DrawRect(-5, 35, 60, 30, this.outfitColor);   // Shorts
            } break;
        }

        PopMatrix();
    }

    DrawLeg(x, y, angle)
    {
        PushMatrix(x, y, angle);

        let legColor = this.skinColor;

        // Use pants?
        switch(this.styleLower)
        {
            case EnemyStyleLowerPants:
            {
                legColor = this.outfitColor;
            } break;
        }

        DrawCircle(0, 0, 13, legColor);     // Rounded top of leg
        DrawRect(0, 15, 26, 30, legColor);  // Leg
        DrawRect(0, 25, 26, 25, this.bootColor);  // Boot
        DrawRect(-5, 20, 10, 4, this.lacesColor);  // Top lace
        DrawRect(-5, 27, 10, 4, this.lacesColor);  // Middle lace
        //DrawRect(-5, 34, 10, 4, this.lacesColor);  // Bottom lace

        PopMatrix();
    }

    DrawHead(x, y, angle)
    {
        PushMatrix(x, y, angle);

        DrawRect(0, 0, 50, 50, this.skinColor); // Head

        switch(this.styleHead)
        {
            case EnemyStyleHeadNormal:
            {
                DrawRect(-12, 0, 9, 15, this.eyeColor);   // Left eye
                DrawRect(5, 0, 9, 15, this.eyeColor);   // Right eye
            } break;
        }

        PopMatrix();
    }

    DrawArm(x, y, angle)
    {
        PushMatrix(x, y, angle);
        DrawCircle(-1.5, 1.5, 19, this.outlineColor); // Armpit shadow
        DrawCircle(-1.5, 13.5, 12, this.outlineColor); // Armpit shadow
        DrawCircle(0, 0, 19, this.skinColor);   // Upper
        DrawCircle(0, 12, 12, this.skinColor); // Lower
        PopMatrix();
    }
}
