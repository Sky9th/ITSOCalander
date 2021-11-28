<template>
	<div>
		<h1>calendar</h1>
		<el-row :gutter="5">
			<el-col :span="20" id="calendar-main">
				<FullCalendar id="calendar" ref="fullCalendar" :options="calendarOptions" />
			</el-col>
			<el-col :span="4" id="calendar-option">
				<el-button @click="today">Today</el-button>
				<el-button @click="timeSlot">Create time slot</el-button>
				<el-button @click="timeSlotEdit">Edit time slot</el-button>
			</el-col>

		</el-row>
	</div>
</template>

<script>
	import '@fullcalendar/core/vdom' // solves problem with Vite
	import FullCalendar from '@fullcalendar/vue'
	import dayGridPlugin from '@fullcalendar/daygrid'
	import interactionPlugin from '@fullcalendar/interaction'
	import {
		Calendar
	} from '@fullcalendar/core';

	let events = [];
	var calendarEl = document.getElementById('calendar');
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
					locale: 'cn',
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
					selectable: false,
					events: events
				}
			}
		},
		methods: {
			handleDateClick: function(arg) {
				let calendarApi = this.$refs.fullCalendar.getApi();
				calendarApi.setOption({
					dayMaxEventRows: true, // for all non-TimeGrid views
					views: {
						timeGrid: {
							dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
						}
					}
				});
				console.log('date click! ' + arg.dateStr);
			},
			handleEventClick: function(event) {
				let calendarApi = this.$refs.fullCalendar.getApi();
				event.title = "CLICKED!";
				calendarApi.setOption("updateEvent", event);
				var calendar = new Calendar(calendarEl, {
					plugins: [dayGridPlugin]
				});
				this.$refs.fullCalendar('removeEvents');
				calendar.render();
				console.log(calendar);
			},
			today: function() {
				let calendarApi = this.$refs.fullCalendar.getApi();
				calendarApi.today();
			},
			timeSlot: function() {
				let calendarApi = this.$refs.fullCalendar.getApi();
				calendarApi.setOption('selectable', true);
				calendarApi.setOption('select', this.timeSlotCreate);
			},
			timeSlotCreate: function(arg) {
				let calendarApi = this.$refs.fullCalendar.getApi();
				calendarApi.setOption('events', [{
					start: arg.start,
					end: arg.end,
					allDay: true,
					display: 'background',
					className: ["bg-green"]
				}]);
				events.push({
					id: events.length,
					title: 'test',
					start: arg.start,
					end: arg.end,
					className: ["bg-fire"],
					allDay: true
				})
				calendarApi.setOption('events', events);
				this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', '标题名称', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定'
				}).then(() => {
					calendarApi.setOption('selectable', false);
				}).catch(() => {
					calendarApi.setOption('selectable', false);
				});
				console.log('timeSlotCreate! ' + arg.start + arg.end)
			},
			timeSlotEdit: function() {
				let newEvents = []
				events.forEach(item => {
					item.editable = true;
					newEvents.push(item);
				})
				let calendarApi = this.$refs.fullCalendar.getApi();
				calendarApi.setOption('events', newEvents);
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

	.bg-fire {
		background-color: #9D0006;
		border: none;
		padding: 0 10px;
	}
</style>
