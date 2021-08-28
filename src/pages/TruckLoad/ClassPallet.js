class CPallet {
    constructor(x, y, width, height, type) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.type = type
    }

    draw(ctx) {
        ctx.shadowColor = this.type === 'american' ? 'rgba(232,104,139,0.42)' : 'rgba(61,73,208,0.37)';
        ctx.shadowBlur = 5;

        const gradient = ctx.createLinearGradient(this.x, this.y , this.x + this.width,this.y+this.height);

        gradient.addColorStop(0, this.type === 'american' ? 'rgba(232,104,139,0.65)' : 'blue');
        gradient.addColorStop(.5, this.type === 'american' ? 'red' : '#15319c')
        gradient.addColorStop(1, this.type === 'american' ? 'rgba(232,104,139,0.71)' : 'blue');

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#fff';

        ctx.font=`${this.width < 70 || this.height < 70 ? '10px' : '17px'} Sans-serif`;
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            `${(this.width/100).toFixed(1)}x${(this.height/100).toFixed(1)}`,
            this.x + (this.width / 2),
            this.y + (this.height / 2));
        // ctx.fillText(
        //     `${(this.width/100).toFixed(1)}`,
        //     this.x + (this.width / 2),
        //     this.y + 13);
        //
        // ctx.fillText(
        //     `${(this.height/100).toFixed(1)}`,
        //     this.x + 13,
        //     this.y + (this.height / 2));
    }
}

export { CPallet };