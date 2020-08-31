class Enemy_SlowRun extends Enemy
{
    constructor()
    {
        super();
        this.vel.Set(-12, 0);

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperNone;
        this.styleHead = EnemyStyleHeadShortHair;
        this.skinColor = "#DC774F";
        this.outlineColor = "#A3583A";
        this.outfitColor = "#B00";
        this.bootColor = "#B00";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#663508";
        this.SetAnim(EnemyAnimRun);
    }
}
