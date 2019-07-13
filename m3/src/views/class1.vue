// author kirahan
// 2018.12.25
// ver 0.5.0
// 三阶魔方学习的第一课   认识魔方

<template>
  <v-container fluid>
    <ClassTimer :command="classTimerCommand" class="classtimer" type="s" size="30px" width="200px"></ClassTimer>
    <v-layout row wrap>
      <v-flex xs12 md5 v-if="cube.show" style="background-color:#1d2935">
        <Cube :cubearrow="cube.arrow" :cubeid="cube.Cid" :cubesize="cube.Csize" :fov="cube.fov" :showtools="true"/>
      </v-flex>

      <v-flex xs12 md7 style="font-size:30px">
        <v-stepper
          style="border-radius:10px;background-color:#f2f2f2"
          v-model="stepSwithValue"
          vertical
        >
          <v-stepper-step :complete="stepSwithValue > 1" step="1">魔方的历史
            <v-icon class="text-xs-center" large style="display:contents">volume_up</v-icon>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card
              color="grey lighten-1"
              style="border-radius:8px;padding:8px"
              class="mb-1"
              height="300px"
            >
              魔方，英文名为Rubik's Cube，又叫鲁比克方块。
              最早是由匈牙利布达佩斯建筑学院厄尔诺·鲁比克教授于1974年发明的。
              魔方与华容道、独立钻石棋一起被国外智力专家并称为智力游戏界的三大不可思议，
              魔方受欢迎的程度更是智力游戏界的奇迹。
            </v-card>
            <v-btn color="primary" small @click="stepSwithValue = 2">下一步</v-btn>
          </v-stepper-content>

          <v-stepper-step color="success" :complete="stepSwithValue > 2" step="2">魔方的颜色</v-stepper-step>

          <v-stepper-content step="2">
            <v-card color="grey lighten-1" class="mb-1" height="350px">
              <p>标准三阶魔方有6种颜色：白、黄、红、橙、蓝、绿</p>
              <div>
                <v-btn class="cube-color" color="white lighten-1"></v-btn>
                <v-btn class="cube-color" color="yellow lighten-1"></v-btn>
                <v-btn class="cube-color" color="red lighten-1"></v-btn>
                <v-btn class="cube-color" color="orange lighten-1"></v-btn>
                <v-btn class="cube-color" color="blue lighten-1"></v-btn>
                <v-btn class="cube-color" color="green lighten-1"></v-btn>
              </div>
              <v-divider dark></v-divider>
              <v-flex xs8 text-xs-center>
                <v-btn class="cube-color" color="white lighten-1"></v-btn>对面是
                <v-btn class="cube-color" color="yellow lighten-1"></v-btn>
                <br>
                <v-btn class="cube-color" color="red lighten-1"></v-btn>对面是
                <v-btn class="cube-color" color="orange lighten-1"></v-btn>
                <br>
                <v-btn class="cube-color" color="blue lighten-1"></v-btn>对面是
                <v-btn class="cube-color" color="green lighten-1"></v-btn>
              </v-flex>
            </v-card>
            <v-btn color="success" small @click="stepSwithValue = 1">上一步</v-btn>
            <v-btn color="success" small @click="stepSwithValue = 3">下一步</v-btn>          
            </v-stepper-content>

          <v-stepper-step color="purple lighten-1" :complete="stepSwithValue > 3" step="3">魔方的结构</v-stepper-step>

          <v-stepper-content step="3">
            <v-card color=" lighten-1" row class="mb-1" height="350px">
              <v-layout align-center justify-center row fill-height>
                <v-flex xs6 text-xs-left>
                  <v-btn @click="showcenters()" color="success" class="btn-cube-module">中心块</v-btn>
                  <v-btn @click="showcorners()" color="warning" class="btn-cube-module">角快</v-btn>
                  <v-btn @click="showedges()" color="error" class="btn-cube-module">棱快</v-btn>
                  <v-btn @click="showall()" color="primary" class="btn-cube-module">重置</v-btn>
                  <br>
                  <v-btn @click="togglearrow(`R`)" color="success" class="btn-cube-module">∧</v-btn>
                  <v-btn @click="togglearrow(`U`)" color="warning" class="btn-cube-module"><</v-btn>
                  <v-btn @click="togglearrow(`R'`)" color="error" class="btn-cube-module">∨</v-btn>
                  <v-btn @click="togglearrow(`U'`)" color="" class="btn-cube-module">></v-btn>
                  <br>
                  <v-btn @click="cubetwist(0)" color="success" class="btn-cube-module">动作:上</v-btn>
                  <v-btn @click="cubetwist(1)" color="warning" class="btn-cube-module">动作:左</v-btn>
                  <v-btn @click="cubetwist(2)" color="error" class="btn-cube-module">动作:下</v-btn>
                  <v-btn @click="cubetwist(3)" color="" class="btn-cube-module">动作:右</v-btn>
                  <v-btn @click="cubetwist(4)" color="success" class="btn-cube-module">上左下右＊6</v-btn>
                </v-flex>
                <v-flex xs6 style="height:100%">
                  <v-alert
                    style="height:100%;font-size:30px"
                    :value="true"
                    color="grey darken-2"
                  >{{distext}}</v-alert>
                </v-flex>
              </v-layout>
            </v-card>
            <v-btn color="purple lighten-1" small @click="stepSwithValue = 2">上一步</v-btn>
          </v-stepper-content>

         
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Cube from "Components/Cube";
import ClassTimer from "Components/ClassTimer";
import libcube from "Lib/cubes.js";
// import { watch } from "fs";

export default {
  components: {
    Cube,
    ClassTimer
  },
  data: () => ({
    student: "赵晗",
    classTimerCommand: "waiting",
    distext:'',
    cube: {
      Cid: "cube1",
      show: true,
      arrow: {
        show : false,
        formula : "F",
      },
      Csize: {
        width: "600px",
        height: "600px"
      },
      fov: 40
    },
    stepSwithValue : 1,
    formulaTest : {
      bgStyle:'cyan darken-2',
      cubeConfig:{
        Cid: "cubeTest1",
        show: true,
        Csize: {
          width: "400px",
          height: "400px"
        },
        fov: 40,
        movehistory: []
      },
      cubeStyle:{
      },
      cubeRunscript:{},
    }
   
  }),
  methods: {
    // 绑定cube1 和 蓝牙魔方
    addCubeEvent: function() {
      window.zhCube.addEventListener("gikMove", "bindcube", function(d) {
        console.log(d);
        if (d.latestMove.amount == 1) {
          cube1.twistQueue.add(d.latestMove.base);
        } else {
          cube1.twistQueue.add(d.latestMove.base + "'");
        }
      });
      // gik.removeEventListener('flower3');
      // gik.addEventListener('courseTask','flower1',gikEvent.s3e1);
    },
    // 格式化时间   计时器
    formatTime: function(duration, type) {
      if (type == "s") {
        let ms = String(duration % 1000);
        let sec = String(Math.floor((duration % (1000 * 60)) / 1000));
        let min = String(Math.floor((duration % (1000 * 60 * 60)) / 1000 / 60));
        let hour = String(
          Math.floor((duration % (1000 * 60 * 60 * 24)) / 1000 / 60 / 60)
        );

        sec = sec + "秒";

        if (min == "0" && hour == "0") min = "";
        else min = min + "分";

        if (hour == "0") hour = "";
        else hour = hour + "小时";
        return hour + min + sec;
      } else if (type == "ms") {
        let ms = String(duration % 1000);
        let sec = String(Math.floor((duration % (1000 * 60)) / 1000));
        let min = String(Math.floor((duration % (1000 * 60 * 60)) / 1000 / 60));
        ms = ms + "秒";
        sec = sec + "点";

        if (min == "0") min = "";
        else min = min + "分";

        return min + sec + ms;
      }
    },
    togglearrow: function(formula){
      if(this.cube.arrow.show){
        if(this.cube.arrow.formula == formula) this.cube.arrow.show = false
        else {
          this.cube.arrow.show = false
          setTimeout(() => {
            this.cube.arrow.show = true
            this.cube.arrow.formula = formula
          }, 200);
        }
      }else{
        this.cube.arrow.formula = formula
        this.cube.arrow.show = true
      }
    },

    // 只显示棱快
    showedges: function() {
      this.distext =
        "棱快是位于两个角块之间的方块，棱快有2个颜色，一共有___12___个棱快？";
      cube1.hideStickers();
      cube1.edges.showStickers();
      cube1.edges.setRadius(20, function() {
        setTimeout(function() {
          cube1.edges.setRadius(0);
        }, 2000);
      });
    },
    // 只显示中心快
    showcenters: function() {
      this.distext =
        "中心快是位于魔方中心的方块，中心只有1个颜色，刚好就是魔方的6个基本颜色";
      cube1.hideStickers();
      cube1.centers.showStickers();
      cube1.centers.setRadius(50, function() {
        setTimeout(function() {
          cube1.centers.setRadius(0);
        }, 2000);
      });
    },
    // 只显示角块
    showcorners: function() {
      this.distext =
        "角块是位于魔方边角上的方块，角块有3个颜色，一共有___8___个棱快？";
      cube1.hideStickers();
      cube1.corners.showStickers();
      cube1.corners.setRadius(20, function() {
        setTimeout(function() {
          cube1.corners.setRadius(0);
        }, 2000);
      });
    },
    // 全部显示
    showall: function() {
      this.distext = "";
      cube1.showStickers();
    },
    
    // 从stage2 跳转到 stage3
    gotoStage3: function() {
      this.stepSwithValue = 3;
    },
  

    // 上左下右4个指令 集合在一起
    cubetwist: function(value) {
      cube1.twistDuration = 600
      this.cube.arrow.show = false
      if (value == 0) cube1.twistQueue.add("R")
      else if (value == 1) cube1.twistQueue.add("U")
      else if (value == 2) cube1.twistQueue.add("R'")
      else if (value == 3) cube1.twistQueue.add("U'")
      else if (value == 4)
        cube1.twistQueue.add("RUR'U'RUR'U'RUR'U'RUR'U'RUR'U'RUR'U'");
    },
    timer2show() {
      let that = this;
      if (this.formulaTimerCommand == "stop")
        this.formulaTimerCommand = "start";
      if (this.formulaTimerCommand == "waiting")
        this.formulaTimerCommand = "start";
    },
  },
  mounted: function() {
    // 载入之后自动开始课程计时
    this.classTimerCommand = "start";
  },
  computed: {
    //实时绑定魔方连接状态
    GiikerConnectstate() {
      return this.$store.state.isGiikerConnected;
    }
  },
  watch: {
    // 根据状态的变化做出响应，从而实现，蓝牙连接完成之后，自动绑定转动事件
    GiikerConnectstate(newstate, oldstate) {
      var that = this;
      // 蓝牙成功连接
      if (newstate) {
        that.addCubeEvent();
        console.log("bind cube1 to zhcube");
      }
    }
  }
};
</script>

<style scoped>
.classtimer {
  position: absolute;
  left: 0%;
  bottom:0%;
}
.btn-cube-module {
  font-size: 24px !important;
  height: 40px !important;
  font-weight: bold !important;
  min-width: 80px !important;
}
.cube-color {
  font-size: 30px !important;
  border-radius: 5px;
  height: 50px;
  width: 50px;
}
#studyreport strong {
  font-size: 30px;
}
.v-stepper__step--complete {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
</style>
