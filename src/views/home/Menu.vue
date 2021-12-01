<template>
    <el-card style="height:99.7%">
        <div class="system-title" slot="header">Project for Topic 2</div>
        <div class="menu">
            <el-menu default-active="1-1" :router="true">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"/>
                        <span slot="title">ITSO - Calendar</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1" route="/calendar">
                            <i class="el-icon-menu"/>
                            <span>Calendar</span>
                        </el-menu-item>
                        <el-submenu index="1-2">
                            <template slot="title">
                                <i class="el-icon-menu"/>
                                <span>Application</span>
                            </template>
                            <el-menu-item index="1-2-1" route="/managementList">Event List</el-menu-item>
                        </el-submenu>
                        <el-submenu index="1-3">
                            <template slot="title">
                                <i class="el-icon-menu"/>
                                <span>Management</span>
                            </template>
                            <el-menu-item index="1-3-1" route="/applicationList">Event List</el-menu-item>
                            <el-menu-item index="1-3-2" :disabled="true">Event Type</el-menu-item>
                            <el-menu-item index="1-3-3" :disabled="true">Pod Team</el-menu-item>
                            <el-menu-item index="1-3-3" :disabled="true">Statistics</el-menu-item>
                        </el-submenu>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Menu"
    }
</script>

<style scoped>
    .system-title { font-size: 24px; font-weight: bold; }
</style>