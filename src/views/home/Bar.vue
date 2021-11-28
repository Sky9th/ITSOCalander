<template>
    <div>
        <el-card classs="top-bar">
            <div class="top-bar-content">
                <el-button-group>
                    <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
                </el-button-group>
                <el-button-group>
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
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">Login</el-button>
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
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">Submit</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
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
        }
    }
</script>

<style scoped>
    .top-bar-content { display: flex; justify-content: space-between; width: 100%; }
</style>