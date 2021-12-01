<template>
	<div>
		<el-row v-if="!editModel.show" :gutter="5">
			<el-col :span="24" id="calendar-option">
				<el-button @click="today">Today</el-button>
				<el-button @click="timeSlot">Create</el-button>
				<el-button @click="timeSlotEdit">Edit time slot</el-button>
			</el-col>
		</el-row>
		<el-row v-if="editModel.show" :gutter="5">
			<el-col :span="24" id="edit-option">
				<el-button @click="today">Cancel</el-button>
				<el-button @click="timeSlot">Completely</el-button>
			</el-col>
		</el-row>
		<el-row :gutter="5">
			<el-col :span="20" id="calendar-main">
				<FullCalendar id="calendar" ref="fullCalendar" :options="calendarOptions" />
			</el-col>
		</el-row>

		<el-dialog :title="dialogOptions.title" :visible.sync="dialogOptions.visible" :before-close="handleDialogClose">
			<el-form :model="pageForm" :rules="formRules" ref="pageForm" label-width="100px">
				<el-form-item label="Name" class='inp-small' prop="name">
					<el-input v-model="pageForm.name"></el-input>
				</el-form-item>
				<el-form-item label="Date range" prop="dateRange">
					<el-date-picker v-model="pageForm.dateRange" type="daterange" range-separator="~"
						start-placeholder="Begin date" end-placeholder="End date">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="Reminder">
					<el-switch v-model="pageForm.reminder" active-color="#13ce66"></el-switch>
				</el-form-item>
				<el-form-item label="Cycle">
					<el-slider v-model="pageForm.cycle" :step="1" :max="4" :format-tooltip="this.getCycleTip"
						show-stops></el-slider>
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
				<el-button type="success" @click="submitCreate()">Create</el-button>
			</span>
			<span v-else-if="dialogOptions.optionFlag === 'Edit'" slot="footer" class="dialog-footer">
				<el-button @click="dialogOptions.visible = false">Cancel</el-button>
				<el-button type="danger" plain @click="timeSlotDelete()">Delete</el-button>
				<el-button type="primary" @click="submitEdit()">Edit</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import '@fullcalendar/core/vdom' // solves problem with Vite
	import FullCalendar from '@fullcalendar/vue'
	import dayGridPlugin from '@fullcalendar/daygrid'
	import interactionPlugin from '@fullcalendar/interaction'

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
					events: [],
					// dayMaxEventRows: true, // for all non-TimeGrid views
					views: {
						dayGrid: {
							// dayMaxEventRows: 2 // adjust to 6 only for timeGridWeek/timeGridDay
						}
					}
				},
				dialogOptions: {
					visible: false,
					name: '',
					optionFlag: '' //"Create" || "Edit"
				},
				pageForm: {
					id: '',
					name: '',
					dateRange: [],
					reminder: false,
					cycle: 0,
					location: '',
					assignee: '',
					remarks: ''
				},
				formRules: {
					name: [{
						required: true,
						message: 'Name could not empty',
						trigger: 'blur'
					}],
					dateRange: [{
						required: true,
						message: 'Date range could not empty',
						trigger: 'blur'
					}]
				},
				editModel: {
					show: false,
					events: []
				}
			}
		},
		mounted() {
			this.$api.$('listEvents').then((val) => {
				let resourceData = val.data.datas;
				let calendar = this.$refs['fullCalendar'].getApi()
				// let color = ['#4d4cff', '#ff4d4d', '#824da7', '#ff924d', '#ffff4d', '#4da54e'];
				resourceData.forEach((data) => {
					let dateRange = this.dateRangeChange({
						begin: data.startDateTime,
						end: data.endDateTime,
						type: "toCalender"
					})
					let obj = {
						id: data.eventId,
						title: data.eventName + "(" + data.eventStatusDesc + ")",
						start: dateRange.begin,
						end: dateRange.end,
						className: [this.getEventColor(data.riskStatusDesc)],
						allDay: true,
						extendedProps: {
							name: data.eventName,
							status: data.eventStatusDesc,
							reminder: data.reminderFlag === "Y",
							cycle: this.getCycleValue(data.eventTypeDesc).id,
							location: data.location,
							assignee: data.assignee,
							remarks: data.remarks
						}
					}
					console.log(obj)
					calendar.addEvent(obj);
				})
				this.$api.hideLoading()
			})
		},
		methods: {
			getCycleTip: function(step) {
				return this.getCycleValue(step).name;
			},
			getCycleValue: function(key) {
				let cycleModel = {
					id: -1,
					key: "",
					name: ""
				}
				let cycleLsit = [{
					id: 0,
					key: "ONETIME",
					name: "OneTime"
				}, {
					id: 1,
					key: "WEEKLY",
					name: "Weekly"
				}, {
					id: 2,
					key: "MONTHLY",
					name: "Monthly"
				}, {
					id: 3,
					key: "QUARTERLY",
					name: "Quarterly"
				}, {
					id: 4,
					key: "YEARLY",
					name: "Yearly"
				}];
				for (let cycle of cycleLsit) {

					if (cycle.id === key || cycle.key === key || cycle.name === key) {
						cycleModel = cycle;
					}
				}
				return cycleModel;
			},
			getEventColor: function(status) {
				console.log(status)
				let colorClass;
				switch (status) {
					case "NORMAL":
						colorClass = "bg-normal";
						break;
					case "LOW":
						colorClass = "bg-low";
						break;
					case "MEDIUM":
						colorClass = "bg-medium";
						break;
					case "HIGH":
						colorClass = "bg-high";
						break;
					case "CRITIAL":
						colorClass = "bg-fire";
						break;
					default:
						break;
				}
				return colorClass
			},
			handleDateClick: function(arg) {
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
					name: event.extendedProps.name,
					dateRange: [dateRange.begin, dateRange.end],
					reminder: event.extendedProps.reminder,
					cycle: this.getCycleValue(event.extendedProps.cycle).id,
					location: event.extendedProps.location,
					assignee: event.extendedProps.assignee,
					remarks: event.extendedProps.remarks
				}
				this.dialogOptions = {
					visible: true,
					optionFlag: 'Edit',
					title: "View Detail"
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
					optionFlag: 'Create',
					title: "Create"
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
					title: "Create"
				}
			},
			timeSlotEdit: function() {
				this.editModel.events = []
				let calendarApi = this.$refs.fullCalendar.getApi();
				let oldEvents = calendarApi.getEvents()
				console.log(oldEvents)
				oldEvents.forEach(item => {
					this.editModel.events.push(item);
					item.remove();
				})
				calendarApi.setOption('events', this.editModel.events);
				calendarApi.setOption('editable', true);
				calendarApi.setOption('selectable', false);
				calendarApi.setOption('eventClick', () => {});
				this.editModel.show = true;
			},
			timeSlotDelete: function() {
				this.$confirm(
						'Are you sure you want to delete it？',
						'Delete Eevent', {
							confirmButtonText: 'sure',
							cancelButtonText: 'cancle',
							type: 'warning'
						})
					.then(() => {
						this.$api.$(
							'deleteEvent',
							null, {
								id: this.pageForm.id
							},
						).then(() => {
							let calendarApi = this.$refs.fullCalendar.getApi();
							let event = calendarApi.getEventById(this.pageForm.id);
							event.remove();
							this.resetForm();
							this.dialogOptions.visible = false;
							this.$message({
								type: 'success',
								message: 'Have deleted!'
							});
							this.$api.hideLoading()
						})
					});
			},
			submitCreate: function() {
				this.$refs['pageForm'].validate((valid) => {
					if (valid) {
						let request = {
							eventName: this.pageForm.name,
							eventTypeDesc: this.getCycleValue(this.pageForm.cycle).key,
							location: this.pageForm.location,
							assignee: this.pageForm.assignee,
							remarks: this.pageForm.remarks,
							reminderFlag: this.pageForm.reminder ? "Y" : "N",
							startDateTime: this.formatDate(this.pageForm.dateRange[0]),
							endDateTime: this.formatDate(this.pageForm.dateRange[1])
						}

						this.$api.$('createEvents', request).then((response) => {
							let data = response.data.data;
							let dateRange = this.dateRangeChange({
								begin: data.startDateTime,
								end: data.endDateTime,
								type: "toCalender"
							})
							let calendarApi = this.$refs.fullCalendar.getApi();
							calendarApi.addEvent({
								id: data.eventId,
								title: data.eventName + "(" + data.eventStatusDesc + ")",
								start: dateRange.begin,
								end: dateRange.end,
								className: [this.getEventColor(data.riskStatusDesc)],
								allDay: true,
								extendedProps: {
									name: data.eventName,
									status: data.eventStatusDesc,
									reminder: data.reminderFlag === "Y",
									cycle: this.getCycleValue(data.eventTypeDesc).id,
									location: data.location,
									assignee: data.assignee,
									remarks: data.remarks
								}
							})
							// For input data
							/*calendarApi.addEvent({
								id: events.length,
								title: this.pageForm.name + "(PENDING)",
								start: dateRange.begin,
								end: dateRange.end,
								className: ["bg-normal"],
								allDay: true,
								extendedProps: {
									name: this.pageForm.name,
									status: "PENDING",
									reminder: this.pageForm.reminder,
									cycle: this.pageForm.cycle,
									location: this.pageForm.location,
									assignee: this.pageForm.assignee,
									remarks: this.pageForm.remarks
								}
							})*/
							this.dialogOptions.visible = false;
							this.$api.hideLoading()
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitEdit: function() {
				this.$refs['pageForm'].validate((valid) => {
					if (valid) {
						let request = {
							eventName: this.pageForm.name,
							eventTypeDesc: this.getCycleValue(this.pageForm.cycle).key,
							location: this.pageForm.location,
							assignee: this.pageForm.assignee,
							remarks: this.pageForm.remarks,
							reminderFlag: this.pageForm.reminder ? "Y" : "N",
							startDateTime: this.formatDate(this.pageForm.dateRange[0]),
							endDateTime: this.formatDate(this.pageForm.dateRange[1])
						}
						this.$api.$('amendEvent', request,this.pageForm.id).then((response) => {
							let data = response.data.data;
							let dateRange = this.dateRangeChange({
								begin: data.startDateTime,
								end: data.endDateTime,
								type: "toCalender"
							});

							let calendarApi = this.$refs.fullCalendar.getApi();
							let event = calendarApi.getEventById(data.eventId);
							event.setProp("title", data.eventName + "(" + data.eventStatusDesc + ")");
							event.setDates(
								dateRange.begin,
								dateRange.end, {
									allDay: true
								},
							);
							event.setExtendedProp("name", data.eventName);
							event.setExtendedProp("status", data.eventStatusDesc);
							event.setExtendedProp("reminder", data.reminderFlag === "Y");
							event.setExtendedProp("cycle", this.getCycleValue(data.eventTypeDesc).id);
							event.setExtendedProp("location", data.location);
							event.setExtendedProp("assignee", data.assignee);
							event.setExtendedProp("remarks", data.remarks);
							this.dialogOptions.visible = false;
							this.$api.hideLoading()
						})
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
					reminder: false,
					cycle: 0,
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
			},
			formatDate: function(time) {
				let date = new Date(time);
				return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
			}
		}
	}
</script>

<style>
	.bg-normal,
	.bg-low,
	.bg-medium,
	.bg-high,
	.bg-fire {
		border: none;
		padding: 0 10px;
	}

	.bg-normal {
		background-color: #a7a7a7;
	}

	.bg-low {
		background-color: #3788d8;
	}

	.bg-medium {
		background-color: #ffff4d;
		color: #000000 !important;
	}

	.bg-medium.fc-h-event .fc-event-main {
		color: #000000;
	}

	.bg-high {
		background-color: #ff924d;
	}

	.bg-fire {
		background-color: #ff4949;
	}

	.el-form input {
		width: 350px;
	}

	.el-form .inp-small input {
		width: 200px;
	}

	.el-form div[role="slider"] {
		width: 350px;
	}


	.el-form textarea {
		width: 350px;
		height: 200px;
	}

	.fc-h-event .fc-event-title {
		word-break: break-all;
		white-space: break-spaces;
	}
</style>
