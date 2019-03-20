<template>
    <div :style="timerStyle"> 
        <div v-if="type=='s'">
            <strong v-if="min!='0'">{{hour}}:</strong>
            <strong>{{min}}:</strong>
            <strong>{{sec}}</strong>
            
        </div>
        <div v-if="type=='ms'">
            <strong v-if="min!='00' && min!='0'">{{min}}:</strong>
            <strong>{{sec}}.</strong>
            <strong>{{ms}}</strong>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            state : 'waiting',
            start : '',
            hour : '0',
            min : '00',
            sec: '00',
            ms : '000',
        };
    },
    props: ["command", "color", "size", "width","bg","type"],
    computed: {
        timerStyle() {
            return {
                "font-size": this.size || '20px',
                "text-align" : 'center',
                width : this.width || '100px',
                color: this.color || 'black',
                background: this.bg || 'white',
                
            };
        }
    },
    watch: {
        command: function(){
            this.show()
        }
    },
    methods: {
        show() {
            this.state = this.command || 'waiting'
            this.showTime();
            if (this.state == 'waiting') {
                clearInterval(this._timer)
            }
            if(this.state == 'timing' || this.state == 'start'){
                
                        if(this.type == 's'){
                        this._timer = setInterval(() => {
                        this.showTime();
                        }, 1000);
                    }else if(this.type == 'ms'){
                        this._timer = setInterval(() => {
                        this.showTime();
                        }, 27);
                    }
                // }
            }
            if (this.state == 'stop') {
                clearInterval(this._timer)
            }
        },
        showTime() {
            if(this.state == 'waiting'){
                    this.start = ''
                    this.hour = '0'
                    this.min = '00'
                    this.sec= '00'
                    this.ms = '000'
            }
            if(this.state == 'start'){
                this.start = Date.now()
                this.state = 'timing'
            }
            if(this.state == 'timing' || this.state == 'stop'){
                let now = Date.now()
                let duration = now - this.start
                let ms = String(duration%1000)
                let sec =String(Math.floor(duration%(1000*60)/1000))
                let min =String(Math.floor(duration%(1000*60*60)/1000/60))
                let hour =String(Math.floor(duration%(1000*60*60*24)/1000/60/60))

                if(ms.length == 1) this.ms = '00' + ms
                else if(ms.length == 2) this.ms = '0' + ms
                else this.ms = ms

                if(sec.length == 1) this.sec = '0' + sec
                else this.sec = sec

                if(min.length == 1) this.min = '0' + min
                else this.min = min

                if(hour == '0' && min.length==1){
                    this.min = min
                } 

                if(hour == '0' && min == '0' && sec.length == 1){
                    this.sec = sec
                } 

                if(this.state == 'stop'){
                    clearInterval(this._timer)
                    this.$emit('time-stop',duration)
                    }
            }
            
        }
    },
    mounted() {
        this.show()
    },
    destroyed() {
        if (this._timer) clearInterval(this._timer)
    }
};
</script>

<style scoped>

</style>