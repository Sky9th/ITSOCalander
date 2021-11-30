<template>
    <div>
        <el-card class="top-bar">
            <div class="top-bar-content">
                <el-button-group>
                    <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
                </el-button-group>

                <div class="avatar" v-if="sessionKey">
                    <el-avatar :size="30"><i class="el-icon-user-solid"></i></el-avatar>
                </div>
                <el-button-group v-else>
                    <el-button size="mini" type="default" @click="loginDialogVisible = !loginDialogVisible">Sign in</el-button>
                    <el-button size="mini" type="success" @click="registerDialogVisible = !registerDialogVisible">Sign up</el-button>
                </el-button-group>
            </div>
        </el-card>

        <el-dialog title="Logon" :visible.sync="loginDialogVisible" width="30%" >
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="Staff ID">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="loginDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="logon()">Login</el-button>
            </div>
        </el-dialog>

        <el-dialog title="Register" :visible.sync="registerDialogVisible" width="30%" >
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="Staff ID">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="repeat password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="registerDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="register()">Submit</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import Vue from 'vue';
    import store from '~/store/index'
    import { mapState } from 'vuex'

    export default {
        name: "Bar",
        data () {
            return {
                loginDialogVisible: false,
                registerDialogVisible: false,
                form: {
                    username: 'test',
                    password: '123456'
                }
            }
        },
        computed: mapState([
            // 映射 this.count 为 store.state.count
            'sessionKey'
        ]),
        mounted() {
        },
        methods: {
            logon () {
                this.loginDialogVisible = false;
                Vue.api.$('login', this.form).then(this.session)
            },
            register () {
                this.registerDialogVisible = false;
                Vue.api.$('register', this.form).then(this.session)
            },
            session (val) {
                store.commit('login', val.data.data.sessionKey)
                Vue.api.hideLoading();
            }
        }
    }
</script>

<style>
    .top-bar .el-card__body { padding:10px; }
    .top-bar-content { display: flex; justify-content: space-between; width: 100%; }
</style>