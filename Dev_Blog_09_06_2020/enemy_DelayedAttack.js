class Enemy_DelayedAttack extends Enemy
{
    constructor()
    {
        super();
        this.vel.Set(-12, 0);
        this.subState = 0;
        this.subTimer = 0;

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperTankTop;
        this.styleHead = EnemyStyleHeadLongHair;
        this.skinColor = "#A86741";
        this.outlineColor = "#6D432A";
        this.outfitColor = "#00B";
        this.bootColor = "#00B";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#111";
        this.SetAnim(EnemyAnimRun);
    }

    MoveToPlayer()
    {
        super.MoveToPlayer();

        switch (this.subState)
        {
            case 0:
            {
                if (this.pos.x <= 640)
                {
                    this.pos.x = 640;
                    this.vel.x = 0;
                    this.subState = 1;
                    this.subTimer = 40;
                }
            } break;

            case 1:
            {
                if (Math.floor(this.subTimer / 10) % 2 == 0)
                {
                    this.pos.Set(640, 296);
                    this.angle = 0;
                }
                else
                {
                    this.pos.Set(640, 284);
                    this.angle = this.subTimer > 20 ? -15 : 15;
                }

                this.subTimer--;
                if (this.subTimer == 0)
                {
                    this.subState = 2;
                    this.pos.y = 296;
                    this.vel.x = -20;
                }
            } break;

            case 2:
            {

            } break;
        }
    }
}
