class Hub
{
    constructor()
    {
        this.x = 340;
        this.y = 100;
    }

    Tick()
    {

    }

    Draw()
    {
        DrawRect(this.x, this.y, 32, 32, "#444", 0.0);
    }
}