<template>
    <div>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="eventName"
                    label="event name"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="startDateTime"
                    label="start date"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="endDateTime"
                    label="end date">
            </el-table-column>
            <el-table-column
                    prop="assignee"
                    label="assignee">
            </el-table-column>
            <el-table-column
                    prop="createDatetime"
                    label="create time">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    :page-size="50"
                    layout="prev, pager, next"
                    :total="tableData.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "List",
        data () {
            return {
                tableData: []
            }
        },
        mounted() {
            this.$api.$('listEvents').then((val) => {
                this.tableData = val.data.datas;
                this.$api.hideLoading();
            })
        }
    }
</script>

<style scoped>
    .pagination { display: flex; justify-content: center;margin-top: 15px; }
</style>