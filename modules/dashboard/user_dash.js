CURRENT_PATH = '../../';

$.fn.populate_user_detail = function ()
{
	try
	{
		$.fn.fetch_data
			(
				$.fn.generate_parameter('populate_dashboard_all_user_detail', { user_id: SESSIONS_DATA.id, client_id: SESSIONS_DATA.client_id }),
				function (return_data)
				{
					if (return_data.data)
					{
						$('#tbl_list > tbody').empty();
						let data = return_data.data;
						let row = '';
						row += `<tr class="textcenter">${ data[0].name }</tr>`;
						for (let i = 0; i < data.length; i++)
						{
							var res = data[i].page.split(".");
							row += `<tr class="">
									<td>${ res[0] }</td>
									<td class="text-center">${ data[i].duration }</td>
								</tr>`;
						}
						row += `<tr class="texthead">
								<td class="fw-bold">Total Duration</td>
	                            <td  class="fw-bold text-center">${ data[0]['totalduration'] }</td>
                            </tr>`;

						$('#tbl_list tbody').append(row);
						$('#userdata').show();
					}

				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.got_to_task = function (task_no)
{
	try 
	{
		if (task_no != '')
		{
			window.open("task/my-task?task_no=" + task_no + "&method=details", '_blank');
		}
	}
	catch (e)
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.get_list = function ()
{
	try
	{
		let company_id = SESSIONS_DATA.company_id;
		let user_id = SESSIONS_DATA.id;

		let myDate = new Date();
		let myDates = new Date(myDate);
		myDates.setDate(myDates.getDate() + 30);
		let end_date = Math.round(myDates.getTime() / 1000.0);
		let param =
		{
			filter_val: '1,2,3,4',
			company_id: company_id,
			start: '1500550716', //"2017-07-20"
			end: end_date,
			user_id: user_id,
			client_id: SESSIONS_DATA.client_id
		};
		let event_value_arr = [];
		$.fn.write_data
			(
				$.fn.generate_parameter('get_user_web_dashboard', param),
				function (return_data)
				{
					if (return_data.data)
					{
						let events = return_data.data.events;
						for (var i = 0, l = events.length; i < l; i++)
						{
							let event_value = {};
							event_value['id'] = events[i].id;
							event_value['title'] = events[i].title;
							event_value['start'] = events[i].start;
							if (events[i].start != events[i].end)
							{
								var end = new Date(events[i].end);
								end.setDate(end.getDate());
							}
							else
							{
								end = events[i].end;
							}
							event_value['end'] = end;
							event_value['type'] = events[i].type;
							if (events[i].type == "holiday")
							{
								className = 'bg-success';
							}
							else if (events[i].type == "task")
							{
								className = 'bg-info';
							}
							else if (events[i].type == "leave")
							{
								className = 'bg-danger';
							}
							else if (events[i].type == "appointment")
							{
								className = 'bg-warning';
							}
							else
							{
								className = 'bg-primary';
							}
							event_value['className'] = className;
							event_value_arr.push(event_value);
						}

						// $("#app_count_id").text(return_data.data.app_count);
						// $("#tasks_count_id").text(return_data.data.tasks_count);
						// $("#contracts_count_id").text(return_data.data.contracts_count);
						// $("#communications_count_id").text(return_data.data.communications_count);
						$("#topusers_id").text(return_data.data.topusers.totalduration);
						if (return_data.data.mosttopusers)
						{
							let most_top_duration = return_data.data.mosttopusers.duration ? return_data.data.mosttopusers.duration : '0:00';
							if (SESSIONS_DATA.id == return_data.data.mosttopusers.id)
							{
								$("#mosttopusers_id").text("You are the top user");
							}
							else 
							{
								$("#mosttopusers_id").text(most_top_duration + " " + "(Top hours)");
							}
						}
					}
					$.fn.load_calender_fun(event_value_arr);
				}, false
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.prepare_form = function ()
{
	try
	{

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.bind_command_events = function ()
{
	try
	{
		$('.close-detail').click(function () 
		{
			$(this).parents('.view-detail').fadeOut('slow');
		});

		$('#btn_close').click(function ()
		{
			$('#userdata').hide();
		});

		$('#top_user_data_check').click(function ()
		{
			$.fn.populate_user_detail();
		});

		$('input[name="appointment_filter[]"]').change(function (event) 
		{
			if ($(this).attr('id') == 'selectall') 
			{
				$('input[type=checkbox]').not(this).prop('checked', this.checked);
			}

			if ($(this).attr('id') != 'selectall') 
			{
				if (!$(this).is(':checked'))
				{
					$('#selectall').prop('checked', false);
				}
			}

			$.fn.get_list();
		});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.form_load = function ()
{
	try
	{
		$.fn.prepare_form();
		$.fn.bind_command_events();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.load_calender_fun = function (event_arr)
{
	!function (l)
	{
		"use strict";
		function e()
		{
			this.$body = l("body"), this.$modal = l("#event-modal"), this.$calendar = l("#calendar"),
				this.$formEvent = l("#form-event"), this.$btnNewEvent = l("#btn-new-event"), this.$btnDeleteEvent = l("#btn-delete-event"),
				this.$btnSaveEvent = l("#btn-save-event"), this.$modalTitle = l("#modal-title"),
				this.$calendarObj = null, this.$selectedEvent = null, this.$newEventData = null;
		}
		e.prototype.onEventClick = function (e)
		{
			this.$formEvent[0].reset(), this.$formEvent.removeClass("was-validated"), this.$newEventData = null,
				this.$selectedEvent = e.event, l("#event-title").val(this.$selectedEvent.title),
				l("#event-category").val(this.$selectedEvent.classNames[0]);

			let leavetype = this.$selectedEvent.extendedProps.type;
			try 
			{
				if (leavetype == 'task') 
				{
					// let due_date = moment(this.$selectedEvent._instance.range.start).format('YYYY-MM-DD');
					// $.fn.fetch_data
					// 	(
					// 		$.fn.generate_parameter('get_tasks_for_dashboard', {
					// 			due_date: due_date,
					// 			is_admin: SESSIONS_DATA.is_admin,
					// 			user_id: SESSIONS_DATA.id,
					// 			client_id: SESSIONS_DATA.client_id
					// 		}),
					// 		function (return_data) 
					// 		{
					// 			$('#display_tasks table > tbody').empty();
					// 			if (return_data.data.length > 0)
					// 			{
					// 				let row = '';
					// 				let data = '';
					// 				data = return_data.data;
					// 				for (var i = 0; i < data.length; i++)
					// 				{
					// 					row += `<tr>
					//                     <td>${ data[i].task_no }</td>
					//                     <td>${ data[i].title }</td>
					//                     <td>${ data[i].task_type_desc }</td>
					//                     <td>${ data[i].task_priority_desc }</td>
					//                     <td>
					//                     	<!--<a href="javascript:void(0);" onclick="$.fn.got_to_task('${ data[i].task_no }')"><i class="fas fa-sign-in-alt"></i></a>-->
					// 						<button type="button" class="btn btn-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip"  onclick="$.fn.got_to_task('${ data[i].task_no }')"">
					// 							<i class="fas fa-sign-in-alt"></i>
					// 						</button>
					//                     </td>
					//                 </tr>`;
					// 				}
					// 				$('#display_tasks table > tbody').append(row);
					// 			}
					// 			$('#display_tasks').modal('show');
					// 		}
					// 	);
				}
				else if (leavetype != 'holiday')
				{
					$.fn.fetch_data
						(
							$.fn.generate_parameter('get_user_dashboard_event_detail', { id: this.$selectedEvent._def.publicId, type: leavetype, client_id: SESSIONS_DATA.client_id }),
							function (return_data) 
							{
								let data = return_data.data;
								for (let propName in data) 
								{
									if (propName == 'people_name') 
									{
										$('#display-' + propName).html(data[propName].split(',').join('\n'));
									}
									else
									{
										$('#display-' + propName).html(data[propName]);
									}
								}

								if (leavetype == 'appointment') 
								{
									$('#display_appointment').modal('show');
								}
								else if (leavetype == 'leave') 
								{
									$('#display_leave').modal('show');
								}
							}
						);
				}
			}
			catch (err) 
			{
				$.fn.log_error(arguments.callee.caller, err.message);
			}

		}, e.prototype.init = function ()
		{
			this.$modal = new bootstrap.Modal(document.getElementById("event-modal"), {
				keyboard: !1
			});
			var e = new Date(l.now());
			new FullCalendar.Draggable(document.getElementById("external-events"), {
				itemSelector: ".external-event",
				eventData: function (e)
				{
					return {
						title: e.innerText,
						className: l(e).data("class")
					};
				}
			});

			var t = event_arr;
			var a = this;

			a.$calendarObj = new FullCalendar.Calendar(a.$calendar[0], {
				slotDuration: "00:15:00",
				slotMinTime: "08:00:00",
				slotMaxTime: "19:00:00",
				themeSystem: "bootstrap",
				bootstrapFontAwesome: !1,
				buttonText: {
					today: "Today",
					month: "Month",
					week: "Week",
					day: "Day",
					list: "List",
					prev: "Prev",
					next: "Next"
				},
				initialView: "dayGridMonth",
				contentHeight: "auto",
				handleWindowResize: !0,
				height: l(window).height() - 200,
				headerToolbar: {
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
				},
				initialEvents: t,
				editable: !0,
				droppable: !0,
				selectable: !0,
				dateClick: function (e)
				{
					a.onSelect(e);
				},
				eventClick: function (e)
				{
					a.onEventClick(e);
				}
			}), a.$calendarObj.render(), a.$btnNewEvent.on("click", function (e)
			{
				a.onSelect({
					date: new Date(),
					allDay: !0
				});
			}), a.$formEvent.on("submit", function (e)
			{
				e.preventDefault();
				var t = a.$formEvent[0];
				if (t.checkValidity())
				{
					if (a.$selectedEvent) a.$selectedEvent.setProp("title", l("#event-title").val()),
						a.$selectedEvent.setProp("classNames", [l("#event-category").val()]); else
					{
						var n = {
							title: l("#event-title").val(),
							start: a.$newEventData.date,
							allDay: a.$newEventData.allDay,
							className: l("#event-category").val()
						};
						a.$calendarObj.addEvent(n);
					}
					a.$modal.hide();
				} else e.stopPropagation(), t.classList.add("was-validated");
			}), l(a.$btnDeleteEvent.on("click", function (e)
			{
				a.$selectedEvent && (a.$selectedEvent.remove(), a.$selectedEvent = null, a.$modal.hide());
			}));
		}, l.CalendarApp = new e(), l.CalendarApp.Constructor = e;
	}(window.jQuery), function ()
	{
		"use strict";
		window.jQuery.CalendarApp.init();
	}();
}

$(document).ready(function ()
{
	$.fn.get_list();
	$.fn.form_load();
});