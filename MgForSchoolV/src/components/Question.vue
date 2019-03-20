<template>
  <v-layout >
      <v-flex xs12>
            <v-card 
            v-if="config.display" 
            :color="config.color"
            :class="config.class"
            >
                <v-card-title :style="config.titleStyle">
                    {{detail.question}}
                </v-card-title>
                        <v-layout column>
                                <v-flex px-2 xs12 v-for="(answer,index) in detail.answers" :key="index" >
                                    <v-btn block :style="config.answerStyle" @click="changecolor(index)" :color="answer.btncolor">
                                        <v-icon  
                                        style="position: absolute;left: 10px;" 
                                            v-if="answer.rightanswer && answer.clicked">check</v-icon>
                                            <div>{{answer.index}}) {{answer.context}}</div>
                                        
                                        <v-icon style="position: absolute;right: 10px;" 
                                                 v-if="!answer.rightanswer && answer.clicked">close</v-icon>
                                    </v-btn>
                                </v-flex>
                        </v-layout>
                
                
            </v-card>
      </v-flex>
      
  </v-layout>
</template>

<script>

export default {
    props : ['config','detail'],
    data () {
        return {
       
        }
    },
    methods : {
        changecolor: function(index){
            let that = this
            this.detail.answers[index].clicked = true
            if(this.detail.answers[index].rightanswer){
                    this.detail.answers[index].btncolor = 'success'
                    setTimeout(() => {
                        that.$emit('question-answer-ok')
                    }, 1000);    
                        
            }else{
                this.detail.answers[index].btncolor = 'orange darken-2'
                this.detail.answers.forEach(element => {
                    if(element.rightanswer){
                        element.clicked = true
                        element.btncolor = 'success'
                    }
                });
            }
            console.log(this.detail.answers[index])
        },
    },
    mounted:function(){
    },
}
</script>
