class Enemy_FastRun extends Enemy
{
    constructor()
    {
        super();
        this.vel.Set(-18, 0);
        
        this.styleLower = EnemyStyleLowerPants;
        this.styleUpper = EnemyStyleUpperTankTop;
        this.styleHead = EnemyStyleHeadBald;
        this.skinColor = "#D8A79E";
        this.outlineColor = "#AA8077";
        this.outfitColor = "#025930";
        this.bootColor = "#025930";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#663508";
        this.SetAnim(EnemyAnimRun);
    }
}
