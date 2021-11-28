<template>
    <el-card classs="top-bar">
        <div class="top-bar-content">
            <el-button-group>
                <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
            </el-button-group>
            <el-button-group>
                <el-button size="mini" type="default">登陆</el-button>
                <el-button size="mini" type="success">注册</el-button>
            </el-button-group>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Bar"
    }
</script>

<style scoped>
    .top-bar-content { display: flex; justify-content: space-between; width: 100%; }
</style>