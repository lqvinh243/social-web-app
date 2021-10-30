<template>
    <div class="w-100 ">
        <div class="chat-area">
            <div class="container">
                <img src="/w3images/bandmember.jpg" alt="Avatar">
                <p>Hello. How are you today?</p>
                <span class="time-right">11:00</span>
            </div>

            <div class="container darker">
                <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right">
                <p>Hey! I'm fine. Thanks for asking!</p>
                <span class="time-left">11:01</span>
            </div>

            <div class="container">
                <img src="/w3images/bandmember.jpg" alt="Avatar">
                <p>Sweet! So, what do you wanna do today?</p>
                <span class="time-right">11:02</span>
            </div>

            <div class="container darker">
                <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right">
                <p>Nah, I dunno. Play soccer.. or learn more coding perhaps?</p>
                <span class="time-left">11:05</span>
            </div>
            <div class="container darker">
                <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right">
                <p>Nah, I dunno. Play soccer.. or learn more coding perhaps?</p>
                <span class="time-left">11:05</span>
            </div>
        </div>
        <div>
            <el-row class="w-100 h-100">
                <el-col :span="22">
                    <el-input v-model="input" placeholder="Please input password" />
                </el-col>
                <el-col :span="2">
                    <i class="el-icon-s-promotion m-auto ml-0" style="font-size:40px" />
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    middleware: ['authentication'],
    data: () => ({
        input: ''
    }),
};
</script>
<style scoped>
body{
    background: #ccc;
}
.container {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

/* Darker chat container */
.darker {
  border-color: #ccc;
  background-color: #ddd;
}

/* Clear floats */
.container::after {
  content: "";
  clear: both;
  display: table;
}

/* Style images */
.container img {
  float: left;
  max-width: 60px;
  width: 100%;
  margin-right: 20px;
  border-radius: 50%;
}

/* Style the right image */
.container img.right {
  float: right;
  margin-left: 20px;
  margin-right:0;
}

/* Style time text */
.time-right {
  float: right;
  color: #aaa;
}

/* Style time text */
.time-left {
  float: left;
  color: #999;
}

.chat-area{
    height: 400px;
    overflow: scroll;
}
</style>

