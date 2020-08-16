class Hub
{
    constructor()
    {
        this.pos = new V2(340, 100);
    }

    Tick()
    {

    }

    Draw()
    {
        DrawRect(this.pos.x, this.pos.y, 32, 32, "#444", 0.0);
    }
}