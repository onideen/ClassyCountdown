/*!
 * jQuery ClassyLED
 * www.class.pm
 *
 * Written by Marius Stanciu - Sergiu <marius@class.pm>
 * Licensed under the MIT license www.class.pm/LICENSE-MIT
 * Version 1.2.0
 *
 */
(function($) {
    $.fn.ClassyCountdown = function(settings) {
        var ClassyCountdown = function(element, settings) {
            this.type;
            this.format;
            this.color;
            // Formated yyyy:MM:dd:hh:mm:ss
            this.countdownDate;
            this.backgroundColor;
            this.rounded;
            this.spacing;
            this.hourFormat;
            this.length = 8;
            this.size;
            this.new_date;
            this.flash = true;
            this.dig = [];
            this.font1 = [" 000    0    000   000     0  00000   00  00000  000   000             ",
                "0   0  00   0   0 0   0   00  0      0        0 0   0 0   0            ",
                "0   0   0       0     0  0 0  0     0         0 0   0 0   0   0        ",
                "0   0   0    000   000  0  0  0000  0000     0   000   0000            ",
                "0   0   0   0         0 00000     0 0   0   0   0   0     0            ",
                "0   0   0   0     0   0    0  0   0 0   0  0    0   0    0    0        ",
                " 000   000  00000  000     0   000   000  0      000   00              "
            ];
            this.font2 = [" 000    0    000  00000    0  00000   00  00000  000   000             ",
                "0   0  00   0   0    0    00  0      0        0 0   0 0   0            ",
                "0  00   0       0   0    0 0  0000  0        0  0   0 0   0   0        ",
                "0 0 0   0     00     0  0  0      0 0000    0    000   0000            ",
                "00  0   0    0        0 00000     0 0   0   0   0   0     0            ",
                "0   0   0   0     0   0    0  0   0 0   0   0   0   0    0    0        ",
                " 000   000  00000  000     0   000   000    0    000   00              "
            ];
            this.font3 = ["00000     0 00000 00000 0   0 00000 00000 00000 00000 00000            ",
                "0   0     0     0     0 0   0 0     0         0 0   0 0   0   0        ",
                "0   0     0     0     0 0   0 0     0         0 0   0 0   0            ",
                "0   0     0 00000 00000 00000 00000 00000     0 00000 00000            ",
                "0   0     0 0         0     0     0 0   0     0 0   0     0            ",
                "0   0     0 0         0     0     0 0   0     0 0   0     0   0        ",
                "00000     0 00000 00000     0 00000 00000     0 00000 00000            "
            ];
            this.led;
            this.__constructor = function(conf) {
                this.type = typeof conf.type !== 'undefined' ? conf.type : 'time';
                this.format = typeof conf.format !== 'undefined' ? conf.format : 'hh:mm';
                this.color = typeof conf.color !== 'undefined' ? conf.color : "#FFF";
                this.countdownDate = conf.countdownDate;
                this.backgroundColor = typeof conf.backgroundColor !== 'undefined' ? conf.backgroundColor : "#000";
                this.rounded = typeof conf.rounded !== 'undefined' ? conf.rounded : 1;
                this.spacing = typeof conf.spacing !== 'undefined' ? conf.spacing : 1;
                this.hourFormat = typeof conf.hourFormat !== 'undefined' ? conf.hourFormat : 24;
                this.fontType = typeof conf.fontType !== 'undefined' ? conf.fontType : 1;
                this.led = this['font' + this.fontType];
                this.size = typeof conf.size !== 'undefined' ? conf.size : 12;
                var ledSize = 12, r, self = this;
                if (this.size < 30) {
                    ledSize = this.size;
                }
                function mtimer(timer) {
                    var n_t = timer.split(":");
                    for (var i = 0; i < n_t.length; i++) {
                        n_t[i] = parseInt(n_t[i], 10);
                    }
                    return n_t;
                }
                function updateTime() {
                    var d = new Date();
                    if (self.type === "countdown") {
                        self.updateDayLed(d);
                    }
                    if (self.type === "time") {
                        self.updateHourLed(d);
                    }
                    else {
                        setTimeout(updateTime, 1000);
                    }
                }
                var start = new Date();
                r = Raphael($(element)[0], this.format.length * 6 * (ledSize + this.spacing) - (ledSize + 2 * this.spacing), 7 * (ledSize + this.spacing) - this.spacing);

                if (this.type === "countdown") {
                    var n_t;
                    if (this.countdownDate === 'undefined') {
                        n_t = mtimer(start.getFullYear() + 1 + ":1:1:0:0:00");
                    } else {
                        n_t = mtimer(this.countdownDate);
                    }

                    this.new_date = new Date(n_t[0], n_t[1] - 1, n_t[2], n_t[3], n_t[4]);
                    for (var i = 0; i < 12 * 6; i++) {
                        this.dig[i] = [];
                        for (var y = 0; y < 7; y++) {
                            this.dig[i][y] = r.rect(i * (ledSize + this.spacing), y * (ledSize + this.spacing), ledSize, ledSize, this.rounded).attr({
                                "fill": this.backgroundColor,
                                "stroke": null
                            });
                        }
                    }
                    updateTime();
                }
                if (this.type === "time") {
                    for (var i = 0; i < ((this.format === "mm:ss" || this.format === "hh:mm") ? 5 : ((this.format === "hh" || this.format === "mm" || this.format === "ss") ? 2 : 8)) * 6; i++) {
                        this.dig[i] = [];
                        for (var y = 0; y < 7; y++) {
                            this.dig[i][y] = r.rect(i * (ledSize + this.spacing), y * (ledSize + this.spacing), ledSize, ledSize, this.rounded).attr({
                                "fill": this.backgroundColor,
                                "stroke": null
                            });
                        }
                    }
                    updateTime();
                }
            };
            this.updateDayLed = function(d) {
                var time_remaining = parseInt((this.new_date.getTime() - d.getTime()) / 1000) + 1;
                var days = parseInt(time_remaining / 86400);
                var hours = parseInt((time_remaining - days * 86400) / 3600);
                var minutes = parseInt((time_remaining - days * 86400 - hours * 3600) / 60);
                var seconds = parseInt(time_remaining - days * 86400 - hours * 3600 - minutes * 60);
                var num = (days < 10 ? "00" : (days > 100 ? "" : "0")) + days + ":" + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
                if ((this.new_date.getTime() - d.getTime()) >= 0) {
                    this._tick(num);
                }
                else {
                    this._tick("000:00:00:00");
                }
            };
            this.updateHourLed = function(d) {
                var num;
                var hours = parseInt(d.getHours());
                hours = (this.hourFormat === 12 ? (hours > 12 ? hours - 12 : hours) : hours);
                var minutes = parseInt(d.getMinutes());
                var seconds = parseInt(d.getSeconds());
                if (this.format === "mm:ss") {
                    num = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
                }
                else if (this.format === "hh:mm") {
                    if (this.flash) {
                        num = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
                    }
                    else {
                        num = (hours < 10 ? "0" : "") + hours + " " + (minutes < 10 ? "0" : "") + minutes;
                    }
                    this.flash = !this.flash;
                }
                else if (this.format === "hh") {
                    num = (hours < 10 ? "0" : "") + hours;
                }
                else if (this.format === "mm") {
                    num = (minutes < 10 ? "0" : "") + minutes;
                }
                else if (this.format === "ss") {
                    num = (seconds < 10 ? "0" : "") + seconds;
                }
                else {
                    num = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
                }
                this._tick(num);
            };
            this._tick = function(num) {
                var razd = 0;
                for (var l = 0; l < num.length; l++) {
                    num.charAt(l) === ":" ? razd = 10 : (num.charAt(l) === " " ? razd = 11 : razd = num.charAt(l));
                    for (var i = 0; i < 6; i++) {
                        for (var y = 0; y < 7; y++) {
                            if (this.led[y].charAt(razd * 6 + i) === "0" && this.dig[l * 6 + i][y].attrs.fill === this.backgroundColor) {
                                this.dig[l * 6 + i][y].animate({
                                    "fill": this.color
                                }, 300);
                            }
                            else if (this.led[y].charAt(razd * 6 + i) === " " && this.dig[l * 6 + i][y].attrs.fill !== this.backgroundColor) {
                                this.dig[l * 6 + i][y].animate({
                                    "fill": this.backgroundColor
                                }, 300);
                            }
                        }
                    }
                }
            };
            return this.__constructor(settings);
        };
        return this.each(function() {
            settings.id = $(this).attr('id');
            return new ClassyCountdown(this, settings);
        });
    };
})(jQuery);