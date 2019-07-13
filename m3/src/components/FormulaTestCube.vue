<template>
  <v-card :color="bgPanel">
    <v-layout column align-center>
      <v-flex xs12>
        <ClassTimer
          :command="timerCommand ||'waiting'"
          :type="timerType || 'ms'"
          :size="timerStyle.size ||'30px'"
          :width="timerStyle.width ||'200px'"
          :color="timerStyle.color ||'black'"
          :background="timerStyle.bg ||'white'"
          @time-stop="saveFormulaResult"
        />
      </v-flex>

      <v-flex xs12 :style="formulaStyle">
          <p>请做:
            <v-btn class="cube-color" :style="calmargin(formulaText)" v-for="(formulaText,formulaIndex) in formulaTextList.text"
                :key="formulaIndex">
              <strong
                :class="calSingleMoveColor(formulaIndex)"
                >{{formulaText}}</strong>
            </v-btn>
          </p>
        

        <p>
            你的:
            <strong
            v-for="(myText,myIndex) in moveHistory"
            :key="myIndex"
            >{{myText}}</strong>
        </p>
        

      </v-flex>

      <v-flex xs12 :style="cubeStyle" >
        <Cube v-if="showCubeFlag"
          :cubestate="cubeStateBefore"
          :cubescript="cubeRunscript"
          :cubeid="cubeConfig.Cid"
          :cubesize="cubeConfig.Csize"
          :fov="cubeConfig.fov"
          :showtools="cubeConfig.showtools || false"
          @cube-tools-turn-command = "addToolsTurnToHistory"
        />
      </v-flex>
      <slot name="tools"></slot>
      <v-flex xs12>
        <v-btn color="error" @click="resetmove()">重来</v-btn>
        <v-btn color="success" @click="close()">关闭</v-btn>
                <div class="alert">
                        <v-alert
                        :value="alertFlag"
                        :type="alertType"
                        transition="scale-transition"
                        >
                        {{alertInfo}}
                        </v-alert>
                </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import Cube from "Components/Cube";
import ClassTimer from "Components/ClassTimer";

export default {
  components: { ClassTimer, Cube },
  props: [
    "cube-config",
    "cube-style",
    "cube-state-before",
    "cube-runscript",
    "timer-style",
    "timer-command",
    "timer-type",
    "formula-text-list",
    "formula-style",
    "bg-panel"
  ],
  data: () => ({
    alertFlag : false,
    alertInfo : '',
    alertType : 'success',
    moveHistory: [],
    formulaResult:{
        finished : false,
        do : {
            best : null
        }
    },
    showCubeFlag : true
  }),
  methods: {
    calSingleMoveColor(index) {
      let that = this;
      if (this.moveHistory.length-1 >= index) {
        if (this.moveHistory[index] == this.formulaTextList.value[index]) {
          return "grey--text lighten-3";
        } else return "red--text lighten-1";
      } else return "black--text";
    },
    saveFormulaResult:function(data) {
      console.log(data);
      this.$emit('timer-command-fastduration',data)
    },

    addToolsTurnToHistory:function(command){
      let movehistory = this.moveHistory;
          movehistory.push(command);
          this.moveHistory = movehistory;
          this.calSingleMoveColor();
    },
    changeblindcube() {
      let that = this;
      if (this.$store.state.isGiikerConnected) {
        zhCube.removeEventListener("bindcube");
        zhCube.removeEventListener("testcube");
        console.log("解绑");
        console.log("重新绑定", that.cubeConfig.Cid);
        zhCube.addEventListener("gikMove", "testcube", function(d) {
          // console.log(d);
          let move;
          if (d.latestMove.amount == 1) move = d.latestMove.base;
          else move = d.latestMove.base + "'";
          window[that.cubeConfig.Cid].twistQueue.add(move);
          let movehistory = that.moveHistory;
          movehistory.push(move);
          that.moveHistory = movehistory;
          that.calSingleMoveColor();
        });
      } else {
            that.alertFlag = true
            that.alertType = 'error'
            that.alertInfo = '请先连接蓝牙'
            setTimeout(() => {
                that.alertFlag = false
            }, 1000);
      }
    },
    resetmove(){
        this.$emit('timer-command-change','waiting')
        this.moveHistory = []
        this.formulaResult.finished = false
        this.showCubeFlag = false
        this.$nextTick(() => {
            this.showCubeFlag = true;//重建组件
        })
    },
    calmargin(text){
        if(text[0] == '(' || text[0] == '（'){
            return {
                "margin-left":'20px'
            }
        }else if(text[0] == ')' || text[0] == '）'){
            return {
                "margin-right":'20px'
            }
        }
    },
    close(){
        let that = this
        if(this.formulaResult.finished){
            this.$emit('timer-command-close',this.formulaResult.do)
        }else{
            this.alertFlag = true
            this.alertType = 'error'
            this.alertInfo = '请完成公式后才能退出'
            setTimeout(() => {
                this.alertFlag = false
            }, 1000);
        }
    },
  },
  mounted:function(){
      this.changeblindcube()
  },
  computed: {
      changehistory(){
          return this.moveHistory
      }
  },
  watch:{
      changehistory(newhistory,oldhistory){
          let that = this
          // console.log('new',newhistory)
          if(newhistory.length == 1){
              
              that.$emit('timer-command-change','start')
          }

          if(newhistory.toString() == that.formulaTextList.value.toString()){
            that.$emit('timer-command-change','stop')
            that.formulaResult.finished = true
          }
      },
  },
};
</script>

<style scoped>
.cube-color {
  font-size: 25px !important;
  border-radius: 5px;
  height: 50px;
  min-width: 50px;
  margin-right: 2px;
  margin-left: 3px;
}
.alert{
    position: absolute!important;
    left:70%;
    right:10%;
    bottom: 30%;
}
</style>
