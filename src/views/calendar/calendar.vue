<template>
	<div>
		<el-row :gutter="5">
			<el-col :span="24" id="calendar-option">
				<el-button @click="today">Today</el-button>
				<el-button @click="timeSlot">Create</el-button>
				<el-button @click="timeSlotEdit">Edit time slot</el-button>
			</el-col>
		</el-row>
		<el-row :gutter="5">
			<el-col :span="20" id="calendar-main">
				<FullCalendar id="calendar" ref="fullCalendar" :options="calendarOptions" />
			</el-col>
		</el-row>

		<el-dialog :title="dialogOptions.title" :visible.sync="dialogOptions.visible" :before-close="handleDialogClose">
			<el-form :model="pageForm" :rules="formRules" ref="pageForm" label-width="100px">
				<el-form-item label="Title" class='inp-small' prop="title">
					<el-input v-model="pageForm.title"></el-input>
				</el-form-item>
				<el-form-item label="Date range" prop="dateRange">
					<el-date-picker v-model="pageForm.dateRange" type="daterange" range-separator="To"
						start-placeholder="Begin date" end-placeholder="End date">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="Assignee" class='inp-small'>
					<el-input v-model="pageForm.assignee"></el-input>
				</el-form-item>
				<el-form-item label="Location">
					<el-input v-model="pageForm.location"></el-input>
				</el-form-item>
				<el-form-item label="Remarks">
					<el-input v-model="pageForm.remarks" type="textarea"></el-input>
				</el-form-item>
			</el-form>
			<span v-if="dialogOptions.optionFlag === 'Create'" slot="footer" class="dialog-footer">
				<el-button @click="dialogOptions.visible = false">Cancel</el-button>
				<el-button type="success" @click="dialogOptions.submitFn()">Create</el-button>
			</span>
			<span v-else-if="dialogOptions.optionFlag === 'Edit'" slot="footer" class="dialog-footer">
				<el-button @click="dialogOptions.visible = false">Cancel</el-button>
				<el-button type="danger" plain @click="timeSlotDelete()">Delete</el-button>
				<el-button type="primary" @click="dialogOptions.submitFn()">Edit</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import '@fullcalendar/core/vdom' // solves problem with Vite
	import FullCalendar from '@fullcalendar/vue'
	import dayGridPlugin from '@fullcalendar/daygrid'
	import interactionPlugin from '@fullcalendar/interaction'
	// import {
	// 	Calendar
	// } from '@fullcalendar/core';

	let events = [];
	// let calendarEl = document.getElementById('calendar');
	export default {
		components: {
			FullCalendar // make the <FullCalendar> tag available
		},
		data() {
			return {
				calendarOptions: {
					plugins: [dayGridPlugin, interactionPlugin],
					initialView: 'dayGridMonth',
					dateClick: this.handleDateClick,
					eventClick: this.handleEventClick,
					select: this.timeSlotCreate,
					selectable: true,
					// width: 800,
					// height: 750,
					//weekends: false, // initial value
					themeSystem: 'bootstrap',
					headerToolbar: {
						start: 'prevYear,prev',
						center: 'title',
						end: 'next,nextYear',
					},
					footerToolbar: {
						start: '',
						center: '',
						end: ''
					},
					locale: 'en',
					// buttonText: {
					// 	prev: '<上一月',
					// 	next: '下一月>',
					// 	prevYear: '<<上一年',
					// 	nextYear: '下一年>>',
					// 	today: '今天',
					// 	month: '月',
					// 	week: '周',
					// 	day: '天'
					// },
					events: events
				},
				dialogOptions: {
					visible: false,
					title: '',
					optionFlag: '', //"Create" || "Edit"
					submitFn: {}
				},
				pageForm: {
					id: '',
					title: '',
					dateRange: [],
					location: '',
					assignee: '',
					remarks: ''
				},
				formRules: {
					title: [{
						required: true,
						message: 'Title could not empty',
						trigger: 'blur'
					}],
					dateRange: [{
						required: true,
						message: 'Date range could not empty',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			handleDateClick: function(arg) {
				// let calendarApi = this.$refs.fullCalendar.getApi();
				console.log('date click! ' + arg.dateStr);
			},
			handleEventClick: function(dom) {
				const event = dom.event;
				this.resetForm();
				let dateRange = this.dateRangeChange({
					begin: event.start,
					end: event.end,
					type: "toNormal"
				})
				this.pageForm = {
					id: event.id,
					title: event.title,
					dateRange: [dateRange.begin, dateRange.end],
					location: event.extendedProps.location,
					assignee: event.extendedProps.assignee,
					remarks: event.extendedProps.remarks
				}
				this.dialogOptions = {
					visible: true,
					optionFlag: 'Edit',
					title: "View Detail",
					submitFn: this.submitEdit
				}
			},
			handleDialogClose: function(done) {
				// let calendarApi = this.$refs.fullCalendar.getApi();
				// calendarApi.render();
				// calendarApi.setOption('events', events);
				this.resetForm();
				console.log("handleDialogClose");
				done();
			},
			today: function() {
				let calendarApi = this.$refs.fullCalendar.getApi();
				calendarApi.today();
			},
			timeSlot: function() {
				this.resetForm();
				this.dialogOptions = {
					visible: true,
					title: "Create",
					submitFn: this.submitCreate
				}
			},
			timeSlotCreate: function(arg) {
				this.resetForm();
				let dateRange = this.dateRangeChange({
					begin: arg.start,
					end: arg.end,
					type: "toNormal"
				})
				this.pageForm.dateRange = [dateRange.begin, dateRange.end];
				this.dialogOptions = {
					visible: true,
					optionFlag: 'Create',
					title: "Create",
					submitFn: this.submitCreate
				}
			},
			timeSlotEdit: function() {
				let newEvents = []
				events.forEach(item => {
					item.editable = true;
					newEvents.push(item);
				})
				let calendarApi = this.$refs.fullCalendar.getApi();
				calendarApi.setOption('events', newEvents);
			},
			timeSlotDelete: function() {
				let calendarApi = this.$refs.fullCalendar.getApi();
				let event = calendarApi.getEventById(this.pageForm.id);
				this.$confirm(
					'Are you sure you want to delete it？',
					'Delete Eevent', {
						confirmButtonText: 'sure',
						cancelButtonText: 'cancle',
						type: 'warning'
					}).then(() => {
					event.remove();
					this.resetForm();
					this.dialogOptions.visible = false;
					this.$message({
						type: 'success',
						message: 'Have deleted!'
					});
				});
			},
			submitCreate: function() {
				this.$refs['pageForm'].validate((valid) => {
					if (valid) {
						let dateRange = this.dateRangeChange({
							begin: this.pageForm.dateRange[0],
							end: this.pageForm.dateRange[1],
							type: "toCalender"
						})
						let calendarApi = this.$refs.fullCalendar.getApi();
						calendarApi.addEvent({
							id: events.length,
							title: this.pageForm.title,
							start: dateRange.begin,
							end: dateRange.end,
							className: ["bg-normal"],
							allDay: true,
							location: this.pageForm.location,
							assignee: this.pageForm.assignee,
							remarks: this.pageForm.remarks
						})
						console.log(calendarApi.getEvents());
						this.dialogOptions.visible = false;
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitEdit: function() {
				this.$refs['pageForm'].validate((valid) => {
					if (valid) {
						let dateRange = this.dateRangeChange({
							begin: this.pageForm.dateRange[0],
							end: this.pageForm.dateRange[1],
							type: "toCalender"
						});
						let calendarApi = this.$refs.fullCalendar.getApi();
						// let events = calendarApi.getEvents();
						let event = calendarApi.getEventById(this.pageForm.id);
						event.setProp("title", this.pageForm.title);
						event.setDates(
							dateRange.begin,
							dateRange.end, {
								allDay: true
							},
						);
						event.setExtendedProp("location", this.pageForm.location);
						event.setExtendedProp("assignee", this.pageForm.assignee);
						event.setExtendedProp("remarks", this.pageForm.remarks);
						this.dialogOptions.visible = false;
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm: function() {
				this.pageForm = {
					title: '',
					dateRange: [],
					location: '',
					assignee: '',
					remarks: ''
				}
				let pageForm = this.$refs['pageForm'];
				if (pageForm != null) {
					pageForm.resetFields();
				}
			},
			/*
			// param : {
			// 	 begin: beginDate,
			// 	 end: endDate,
			// 	 type: "toCalender" || "toNormal"
			// }
			*/
			dateRangeChange: function(param) {
				let dateRange = {
					begin: "",
					end: "",
				}
				const oneDay = 60 * 60 * 24 * 1000; //86400000
				if (param.type == "toCalender") {
					dateRange.begin = new Date(param.begin)
					dateRange.end = new Date(Date.parse(param.end) + oneDay)
				} else {
					dateRange.begin = new Date(param.begin)
					dateRange.end = new Date(Date.parse(param.end) - oneDay)
				}
				return dateRange;
			}
		}
	}
</script>

<style scoped>
</style>
<style>
	.bg-green {
		background-color: #8fdf82;
	}

	.bg-normal {
		background-color: #69bdff;
		border: none;
		padding: 0 10px;
	}

	.bg-fire {
		background-color: #ff4949;
		border: none;
		padding: 0 10px;
	}

	.el-form input {
		width: 350px;
	}

	.el-form .inp-small input {
		width: 200px;
	}

	.el-form textarea {
		width: 350px;
		height: 200px;
	}
</style>
