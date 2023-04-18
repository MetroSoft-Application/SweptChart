class DigitalFilter
{
    in1 = 0.0;
    in2 = 0.0;
    out1 = 0.0;
    out2 = 0.0;
    omega;
    alpha;
    q;
    a0;
    a1;
    a2;
    b0;
    b1;
    b2;
    averageNum;
    internalFilter;
    buffer = [];

    constructor(secControlHz, cutoff, filterType, bandWidth = 1.0)
    {
        this.internalFilter = Number(filterType);
        secControlHz = Number(secControlHz);
        cutoff = Number(cutoff);
        this.omega = 2.0 * Math.PI * cutoff / secControlHz;
        this.q = 1.0 / Math.sqrt(2);

        switch (this.internalFilter)
        {
            // case FilterType.LowPassFilter:
            case 0:
                this.q = 1.0 / Math.sqrt(2);
                this.alpha = Math.sin(this.omega) / (2.0 * this.q);
                this.a0 = 1.0 + this.alpha;
                this.a1 = -2.0 * Math.cos(this.omega);
                this.a2 = 1.0 - this.alpha;
                this.b0 = (1.0 - Math.cos(this.omega)) / 2.0;
                this.b1 = 1.0 - Math.cos(this.omega);
                this.b2 = (1.0 - Math.cos(this.omega)) / 2.0;
                break;

            // case FilterType.HighPassFilter:
            case 1:
                this.q = 1.0 / Math.sqrt(2);
                this.alpha = Math.sin(this.omega) / (2.0 * this.q);
                this.a0 = 1.0 + this.alpha;
                this.a1 = -2.0 * Math.cos(this.omega);
                this.a2 = 1.0 - this.alpha;
                this.b0 = (1.0 + Math.cos(this.omega)) / 2.0;
                this.b1 = -(1.0 + Math.cos(this.omega));
                this.b2 = (1.0 + Math.cos(this.omega)) / 2.0;
                break;

            // case FilterType.BandPassFilter:
            case 2:
                this.alpha = Math.sin(this.omega) * Math.sinh(Math.log(2)) /
                    2.0 * bandWidth * this.omega / Math.sin(this.omega);
                this.a0 = 1.0 + this.alpha;
                this.a1 = -2.0 * Math.cos(this.omega);
                this.a2 = 1.0 - this.alpha;
                this.b0 = this.alpha;
                this.b1 = 0.0;
                this.b2 = -this.alpha;
                break;

            // case FilterType.BandStopFilter:
            case 3:
                this.alpha = Math.sin(this.omega) * Math.sinh(Math.log(2)) /
                    2.0 * bandWidth * this.omega / Math.sin(this.omega);
                this.a0 = 1.0 + this.alpha;
                this.a1 = -2.0 * Math.cos(this.omega);
                this.a2 = 1.0 - this.alpha;
                this.b0 = 1.0;
                this.b1 = -2.0 * Math.cos(this.omega);
                this.b2 = 1.0;
                break;

            // case FilterType.AllPassFilter:
            case 4:
                this.alpha = Math.sin(this.omega) / (2.0 * this.q);
                this.a0 = 1.0 + this.alpha;
                this.a1 = -2.0 * Math.cos(this.omega);
                this.a2 = 1.0 - this.alpha;
                this.b0 = 1.0 - this.alpha;
                this.b1 = -2.0 * Math.cos(this.omega);
                this.b2 = 1.0 + this.alpha;
                break;

            // case FilterType.MovingAvarageFilter:
            case 5:
                this.averageNum = cutoff;
                break;
        }
    }

    FilterControl(input)
    {
        switch (this.internalFilter)
        {
            case 5:
                this.buffer.push(input);
                let sum = 0.0;
                if (this.buffer.length > this.averageNum)
                {
                    this.buffer.shift();
                }
                this.buffer.forEach(function (elem)
                {
                    sum += elem;
                });
                return (sum / this.averageNum);

            default:
                let output = this.b0 / this.a0 * input +
                    this.b1 / this.a0 * this.in1 +
                    this.b2 / this.a0 * this.in2 -
                    this.a1 / this.a0 * this.out1 -
                    this.a2 / this.a0 * this.out2;
                this.in2 = this.in1;
                this.in1 = input;
                this.out2 = this.out1;
                this.out1 = output;

                return output;
        }
    }

    BufferClear()
    {
        this.buffer.slice(0);
    }
}