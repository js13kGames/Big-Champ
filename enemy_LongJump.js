class Enemy_LongJump extends Enemy
{
    constructor()
    {
        super();
        this.color = "#FF0";
        this.pos.Set(this.pos.x + 80, this.pos.y);
        this.vel.Set(-20, -20);
        this.angle = -10;

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperTankTop;
        this.styleHead = EnemyStyleHeadMask;
        this.skinColor = "#6B5142";
        this.outlineColor = "#44332A";
        this.outfitColor = "#6D59C8";
        this.bootColor = "#6D59C8";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#663508";
        this.maskColor1 = "#6D59C8";
        this.maskColor2 = "#FFF";
        this.SetAnim(EnemyAnimSpin);
    }

    MoveToPlayer()
    {
        this.vel.y += 1.0;

        super.MoveToPlayer();

        if (this.pos.y >= 296)
        {
            this.pos.y = 296;
            this.vel.y = -18;
        }

        this.angle -= 10;
    }
}
