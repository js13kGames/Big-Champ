class Enemy_SlowBounce extends Enemy
{
    constructor()
    {
        super();
        this.color = "#00F";
        this.pos.Set(this.pos.x + 140, this.pos.y);
        this.vel.Set(-10, -16);

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperNone;
        this.styleHead = EnemyStyleHeadMask;
        this.skinColor = "#CF7B41";
        this.outlineColor = "#87502B";
        this.outfitColor = "#CCC";
        this.bootColor = "#CCC";
        this.lacesColor = "#000";
        this.eyeColor = "#000";
        this.maskColor1 = "#CCC";
        this.maskColor2 = "#BB0";
        this.SetAnim(EnemyAnimSpin);

        this.isBouncing = true;
    }

    MoveToPlayer()
    {
        this.vel.y += 0.8;

        super.MoveToPlayer();

        if (this.pos.y >= 296)
        {
            this.pos.y = 296;
            this.vel.y = -16;

            if (this.pos.x < gameWidth)
            {
                this.isBouncing = false;
                this.SetAnim(EnemyAnimJump);
                this.angle = -30;
            }
        }

        if (this.isBouncing)
        {
            this.angle -= 10;
        }
    }
}
