// author kirahan
// 2018.12.25
// ver 0.5.0
// 三阶魔方学习的第六课   顶层十字

<template>
  <v-container fluid>
    <ClassTimer :command="classTimerCommand" class="classtimer" type="s" size="30px" width="200px"></ClassTimer>
    <v-layout row wrap>
      <v-flex xs12 md5 v-if="cube.show" style="background-color:#1d2935">
        <Cube :cubearrow="cube.arrow" :cubestate="formulaTest.cubeStateMain" :cubeid="cube.Cid" :cubesize="cube.Csize" :fov="cube.fov" :showtools="true"/>
      </v-flex>

      <v-flex xs12 md7 style="font-size:30px">
         <v-stepper
          style="border-radius:10px;background-color:#f2f2f2"
          v-model="stepSwithValue"
          vertical
        >
          <v-stepper-step :complete="stepSwithValue > 1" step="1">学习目标
            <v-icon class="text-xs-center" large style="display:contents">volume_up</v-icon>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card
              color="grey lighten-1"
              style="border-radius:8px;padding:8px"
              class="mb-1"
              height="350px"
            >
            <v-layout row align-center>
                <v-flex xs5>
                        <Cube :cubestate="formulaTest.cubeStateBefore" cubeid="cube2" :cubesize="taskcubesize" fov="35" :showtools="false"/>
                </v-flex>
                <v-flex xs2>
                          <v-icon class="task-arrow red--text lighten-1">arrow_forward</v-icon>
                </v-flex>
                <v-flex xs5>
                          <Cube :cubestate="formulaTest.cubeStateOk" cubeid="cbue3" :cubesize="taskcubesize" fov="35" :showtools="false"/>
                </v-flex>
            </v-layout>
              
            </v-card>
            <v-btn color="primary" small @click="stepSwithValue = 2">下一步</v-btn>
          </v-stepper-content>

          <v-stepper-step color="success" :complete="stepSwithValue > 2" step="2">基本情况</v-stepper-step>

          <v-stepper-content step="2">
            <v-card color="grey lighten-1" class="mb-1" height="350px">
              <p>口诀：(压)(上左下右)(提) </p>
              <v-divider light ></v-divider>
              <div>
                <v-btn  class="cube-color" color="white lighten-1">
                    第一步：鱼骨头是一条直线，找到鱼骨头
                </v-btn>
                <v-btn  class="cube-color" color="yellow lighten-1">
                    第二步：鱼骨头与自己相平
                </v-btn>
                <v-btn @click="cubetwist(`FRUR'U'F'`,false)" class="cube-color" color="red lighten-1">
                    第三步：做一次口诀(点击演示)
                </v-btn>
                <v-btn @click="resetCube1()" class="cube-color" color="orange lighten-1">
                    重置
                </v-btn>
                <v-divider light ></v-divider>
                <v-btn class="cube-color" 
                :color="stepcounter>0?'white lighten-1':'green lighten-1'">鱼骨与自己相平</v-btn>
                <br>

                <v-btn @click="cubetwist(`F`)" class="cube-color" 
                :color="stepcounter>1?'white lighten-1':'red lighten-1'">压</v-btn>
                                  <v-divider style="height:30px;border-color:black" vertical ></v-divider>

                <v-btn @click="cubetwist(`R`)" class="cube-color" 
                :color="stepcounter>2?'white lighten-1':'orange lighten-1'">上</v-btn>
                <v-btn @click="cubetwist(`U`)" class="cube-color" 
                :color="stepcounter>3?'white lighten-1':'blue lighten-1'">左</v-btn>
                <v-btn @click="cubetwist(`R'`)" class="cube-color " 
                :color="stepcounter>4?'white lighten-1':'green lighten-1'">下</v-btn>
                <v-btn @click="cubetwist(`U'`)" class="cube-color" 
                :color="stepcounter>5?'white lighten-1':'red lighten-1'">右</v-btn>
                                  <v-divider style="height:30px;border-color:black" vertical ></v-divider>

                <v-btn @click="cubetwist(`F'`)"  class="cube-color " 
                :color="stepcounter>6?'white lighten-1':'orange lighten-1'">提</v-btn>
                <br>
              </div>
            </v-card>
            <v-btn color="success" small @click="stepSwithValue = 1">上一步</v-btn>
            <v-btn color="success" small @click="gotoStage3()">下一步</v-btn>
          </v-stepper-content>

          <v-stepper-step color="purple lighten-1" :complete="stepSwithValue > 3" step="3">其他情况</v-stepper-step>

          <v-stepper-content step="3">
            <v-card color="grey lighten-1" row class="mb-1" height="200px">
              <v-layout justify-center row fill-height>
                <v-flex xs12 text-xs-left>
                  <v-btn color="primary" class="cube-color-small">基本口诀:</v-btn>
                  <v-btn @click="cubetwist(`F`,false)" color="success" class="cube-color-small">压</v-btn>
                  <v-btn @click="cubetwist(`RUR'U'`,false)" color="warning" class="cube-color-small">上左下右</v-btn>
                  <v-btn @click="cubetwist(`F'`,false)" color="error" class="cube-color-small">提</v-btn>
                  <br>
                  <v-divider light ></v-divider>
                    <v-btn @click="setCube1toc1()" class="cube-color" color="grey lighten-1">
                        情况1鱼尾巴:
                    </v-btn>
                    <v-btn @click="cubetwist(`FRUR'U'F'`,false)" class="cube-color" color="green lighten-1">
                        先做一遍
                    </v-btn>
                    <v-btn @click="cubetwist(`U`,false)" class="cube-color" color="blue lighten-1">
                        变成鱼骨,调整方向
                    </v-btn>
                    <v-btn @click="cubetwist(`FRUR'U'F'`,false)" class="cube-color" color="red lighten-1">
                        再做一遍
                    </v-btn>
                  <br>
                    <v-btn @click="setCube1toc2()" class="cube-color" color="grey lighten-1">
                        情况2鱼蛋:
                    </v-btn>
                    <v-btn @click="cubetwist(`FRUR'U'F'`,false)" class="cube-color" color="green lighten-1">
                        先做一遍,变成鱼尾巴
                    </v-btn>
                    <v-btn @click="cubetwist(`FRUR'U'F'`,false)" class="cube-color" color="red lighten-1">
                        再做一遍
                    </v-btn>
                    <v-btn @click="cubetwist(`U`,false)" class="cube-color" color="blue lighten-1">
                        调整方向
                    </v-btn>
                    <v-btn @click="cubetwist(`FRUR'U'F'`,false)" class="cube-color" color="red lighten-1">
                        再做一遍
                    </v-btn>
                    
                </v-flex>

              </v-layout>
            </v-card>
            <v-btn color="purple lighten-1" small @click="stepSwithValue = 2">上一步</v-btn>
          </v-stepper-content>

        </v-stepper>
      </v-flex>
      <div class="alert">
                        <v-alert
                        :value="alertFlag"
                        :type="alertType"
                        transition="scale-transition"
                        >
                        {{alertInfo}}
                        </v-alert>
      </div>
    </v-layout>
  </v-container>
</template>


<script>
import Cube from "Components/Cube"
import ClassTimer from "Components/ClassTimer"
import classStateList from "Lib/states"
  


export default {
  components: {
    Cube,
    ClassTimer,
  },
  data: () => ({
    student: "赵晗",
    alertFlag : false,
    alertInfo : '',
    alertType : 'success',
    cube: {
      Cid: "cube1",
      show: true,
      arrow: {
        show : false,
        formula : "R",
      },
      Csize: {
        width: "600px",
        height: "600px"
      },
      fov: 40
    },
    taskcubesize: {
        width: "250px",
        height: "250px"
    },
  
    stepSwithValue : 1,
    stepcounter : 1,   //用来整体改变按钮颜色的
    classTimerCommand: "waiting",
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
      cubeStateBefore : classStateList.class6base,
      cubeStateOk : classStateList.class6ok,
      cubeStateMain : classStateList.class6base,
      cubeStateSp : classStateList.class6c1,
      cubeRunscript:{},
    }
  }),
  mounted: function() {
    this.classTimerCommand = 'start'
    if (this.$store.state.isGiikerConnected) {
      zhCube.removeEventListener("bindcube");
      zhCube.addEventListener("gikMove", "bindcube", function(d) {
        console.log(d);
        if (d.latestMove.amount == 1) {
          cube1.twistQueue.add(d.latestMove.base);
        } else {
          cube1.twistQueue.add(d.latestMove.base + "'");
        }
      });
    } else console.log("请连接蓝牙");
  },
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
    timerCommandChange: function(command){
      console.log('[command]',command)
      this.formulaTimerCommand = command
    },
    

    cubetwist:function (params,add=true) {
      cube1.twistDuration = 600;
      cube1.twistQueue.add(params);
      if(add) this.stepcounter++
    },

    iscubeok:function(cubename){
        if(cubename){
        let flag1 = false

        flag1 = cubename.cubeStage.faces.down.white == 9
        if(flag1) {
            // if top 4 edge same
            let Stage = cubename.cubeStage.layer3topcross
            let Keys = Object.keys(Stage)
            if(Keys.length == 1 && Stage[Keys[0]] == 4 && Keys[0] == 'yellow') {
                return true
            }else{
              console.log('top cross not finish')
              return false
            }
        }else{
          console.log('十字没有完成')
          return false
        }
        
      }
    },


    resetCube1 :function(){
      this.formulaTest.cubeStateMain = classStateList.class6base
      this.stepcounter = 1
      this.cube.show = false
      this.$nextTick(() => {
            this.cube.show = true;//重建组件
        })
    },

    setCube1toc1:function(){
        this.formulaTest.cubeStateMain = classStateList.class6c1
        this.cube.show = false
        this.$nextTick(() => {
                this.cube.show = true;//重建组件
            })
    },

    setCube1toc2:function(){
        this.formulaTest.cubeStateMain = classStateList.class6c2
        this.cube.show = false
        this.$nextTick(() => {
                this.cube.show = true;//重建组件
            })
    },


   
    // 从stage2 跳转到 stage3
    gotoStage3: function() {
      this.stepSwithValue = 3;
      this.formulaTest.cubeStateMain = classStateList.class6c1
      this.cube.show = false
      this.$nextTick(() => {
            this.cube.show = true;//重建组件
        })
    },
   

      
    

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
    },

  }
};
</script>


<style scoped>
.classtimer {
  position: absolute;
  left: 0%;
  bottom:0%;
}
.cube-color {
  font-size: 28px !important;
  border-radius: 5px;
  height: 40px;
  min-width: 40px;
}
.cube-color-small{
  color: 'black';
  font-size: 24px !important;
  border-radius: 5px;
  height: 35px;
  min-width: 40px;
}
#studyreport strong {
  font-size: 30px;
}
.task-arrow {
  /* position: absolute; */
  /* z-index: 999999; */
  /* right:40%; */
  /* top:30%; */
  font-size: 80px;
}

.alert{
    position: absolute!important;
    left:70%;
    right:10%;
    bottom: 30%;
}
</style>