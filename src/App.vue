<template>
  <el-container :style="{height: windowHeight+'px'}">
    <el-aside  width="300px">
      <sMenu></sMenu>
    </el-aside>

    <el-container>
      <el-header :height="'80px'">
        <bar></bar>
      </el-header>

      <el-main>
        <el-card>
          <router-view></router-view>
        </el-card>
      </el-main>

      <el-footer style="margin-top: 15px">
        <el-card align="center">Team: @Kaku, @Tabor, @Noct, @Vito</el-card>
      </el-footer>
    </el-container>
  </el-container>
</template>



<script>
  import bar from "./views/home/Bar";
  import sMenu from "./views/home/Menu";

  export default {
    data () {
      return{
        windowHeight: 500
      }
    },
    components:{
      bar,
      sMenu
    },
    mounted () {
      console.log(document.body)
      this.windowHeight = window.innerHeight - 20
    }
  }
</script>

<style>
  body { background: #f9f9f9; }
  .el-main { padding:0 20px; }
</style>
