<template>
    <div>
        <el-table
                :data="tableData"
                style="width: 100%">

            <el-table-column type="expand">
                <template slot-scope="props" >
                    <el-descriptions border>
                        <el-descriptions-item label="Event Name">{{ props.row.eventName }}</el-descriptions-item>
                        <el-descriptions-item label="Start Date">{{ props.row.startDateTime }}</el-descriptions-item>
                        <el-descriptions-item label="End date">{{ props.row.endDateTime }}</el-descriptions-item>
                        <el-descriptions-item label="Event Type">{{ props.row.eventTypeDesc }}</el-descriptions-item>
                        <el-descriptions-item label="Location">{{ props.row.location }}</el-descriptions-item>
                        <el-descriptions-item label="Assignee">{{ props.row.assignee }}</el-descriptions-item>
                        <el-descriptions-item label="Event Status">{{ props.row.eventStatusDesc }}</el-descriptions-item>
                        <el-descriptions-item label="Remarks">{{ props.row.remarks }}</el-descriptions-item>
                        <el-descriptions-item label="Risk">
                            <el-tag :type="riskMap[props.row.riskStatusDesc]">{{ props.row.riskStatusDesc }}</el-tag>
                        </el-descriptions-item>
                    </el-descriptions>
                </template>
            </el-table-column>

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
                    label="Risk"
                    width="180">
                <template slot-scope="scope">
                    <el-tag :type="riskMap[scope.row.riskStatusDesc]">{{ scope.row.riskStatusDesc }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createDatetime"
                    label="create time">
            </el-table-column>
            <el-table-column
                    prop="remarks"
                    label="Remark">
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
                tableData: [],
                riskMap: {
                    NORMAL:'info',
                    LOW:'success',
                    MEDIUM:'',
                    HIGH:'warning',
                    CRITIAL:'danger',
                }
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